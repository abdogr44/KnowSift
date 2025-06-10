import { NextResponse } from 'next/server';
import { Queue } from 'bullmq';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  throw new Error('Upstash Redis env vars are not set');
}

function getRedisConfig() {
  const { hostname } = new URL(UPSTASH_URL!);
  return {
    host: hostname,
    port: 6379,
    username: 'default',
    password: UPSTASH_TOKEN!,
    tls: {},
  };
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
