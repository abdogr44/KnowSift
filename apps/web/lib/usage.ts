import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const PREFIX = 'daily_usage:';

function key(userId: string) {
  const date = new Date().toISOString().split('T')[0];
  return `${PREFIX}${userId}:${date}`;
}

export async function incrementUsage(userId: string): Promise<number> {
  const usage = await redis.incr(key(userId));
  await redis.expire(key(userId), 60 * 60 * 24);
  return usage as number;
}

export async function getUsage(userId: string): Promise<number> {
  const usage = await redis.get<number>(key(userId));
  return usage ?? 0;
}
