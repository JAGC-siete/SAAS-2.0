import type { ConnectionOptions } from 'bullmq';

export const bullConnection: ConnectionOptions = {
  url: process.env.BULL_REDIS_URL || process.env.REDIS_SERVER_URL,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
};