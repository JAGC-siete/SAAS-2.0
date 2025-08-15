import { getUpstashRedis } from './redis.js';
export async function rateLimit({ key, limit, windowSec }: { key: string; limit: number; windowSec: number; }) {
  const redis = getUpstashRedis();
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `${key}:${Math.floor(now / windowSec)}`;
  const count = await redis.incr(windowKey);
  if (count === 1) await redis.expire(windowKey, windowSec);
  return count <= limit;
}