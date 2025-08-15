import { Redis } from '@upstash/redis';
let client: Redis | null = null;
export function getUpstashRedis(): Redis {
  if (!client) {
    const url = process.env.REDIS_URL;
    const token = process.env.REDIS_TOKEN;
    client = new Redis({ url: url as string, token: token as string });
  }
  return client;
}