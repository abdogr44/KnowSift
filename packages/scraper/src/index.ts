export class Scraper {
  scrape(url: string): string {
    return `Scraping ${url}`;
  }
}

export interface TranscriptResult {
  transcript: string;
  metadata: Record<string, unknown>;
}

const ACTOR_ID = 'pintostudio/youtube-transcript-scraper';

/**
 * Calls the Apify actor to fetch a transcript for the given URL.
 *
 * @param url - URL to fetch the transcript for
 * @returns Transcript text and metadata returned from the actor
 */
export async function fetchTranscript(url: string): Promise<TranscriptResult> {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    throw new Error('APIFY_TOKEN is not set');
  }

  const endpoint =
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs/` +
    `run-sync-get-dataset-items?token=${token}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Apify request failed: ${response.status}`);
  }

  const data = await response.json();
  const firstItem = Array.isArray(data) ? data[0] : data;

  return {
    transcript: firstItem.transcript || '',
    metadata: firstItem.metadata || {},
  };
}

import { createClient } from '@supabase/supabase-js';
import { Worker } from 'bullmq';

export async function saveTranscriptToSupabase(
  url: string,
  transcript: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not set');
  }
  const client = createClient(supabaseUrl, supabaseKey);
  await client.from('transcripts').insert({ url, transcript, metadata });
}

function redisConfig() {
  const rest = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!rest || !token) throw new Error('Upstash vars not set');
  const host = new URL(rest).hostname;
  const match = host.match(/-(\d+)\.upstash\.io$/);
  const port = match ? parseInt(match[1], 10) : 6379;
  return { host, port, password: token, tls: {} };
}

export function startWorker() {
  const worker = new Worker(
    'ingest',
    async (job) => {
      const { url } = job.data as { url: string };
      const result = await fetchTranscript(url);
      await saveTranscriptToSupabase(url, result.transcript, result.metadata);
    },
    { connection: redisConfig() },
  );
  return worker;
}
