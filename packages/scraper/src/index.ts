/* eslint-disable */
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

  const endpoint = `https://api.apify.com/v2/acts/${ACTOR_ID}/runs/` +
    `run-sync-get-dataset-items?token=${token}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });

  if (!response.ok) {
    throw new Error(`Apify request failed: ${response.status}`);
  }

  const data = await response.json();
  const firstItem = Array.isArray(data) ? data[0] : data;

  return {
    transcript: firstItem.transcript || '',
    metadata: firstItem.metadata || {}
  };
}
