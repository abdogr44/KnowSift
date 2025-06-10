import { NextResponse } from 'next/server';
import { Queue } from 'bullmq';

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!APIFY_TOKEN) {
  throw new Error('APIFY_TOKEN is not set');
}
if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  throw new Error('Upstash Redis env vars are not set');
}

function getRedisConfig() {
  const host = new URL(UPSTASH_URL!).hostname;
  const match = host.match(/-(\d+)\.upstash\.io$/);
  const port = match ? parseInt(match[1], 10) : 6379;
  return { host, port, password: UPSTASH_TOKEN!, tls: {} };
}

const queue = new Queue('ingest', {
  connection: getRedisConfig(),
});

export async function POST(request: Request) {
  let url: string | null = null;
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await request.json();
    url = body.url;
  } else {
    const data = await request.formData();
    url = data.get('url') as string | null;
  }

  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  await queue.add('scrape', { url });

  return NextResponse.json({ queued: true });
}
