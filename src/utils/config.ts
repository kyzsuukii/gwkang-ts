import 'dotenv/config';

export interface Env {
  BOT_TOKEN: string;
  MONGODB_URI: string;
  RATE_LIMIT?: string;
  RATE_LIMIT_WINDOW?: string;
}

export const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  MONGODB_URI: process.env.MONGODB_URI,
  RATE_LIMIT: process.env.RATE_LIMIT || '5',
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '10s',
} as const;
