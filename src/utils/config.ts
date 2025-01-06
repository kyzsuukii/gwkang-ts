import 'dotenv/config';
import { getEnv } from './env';

export const config = {
  BOT_TOKEN: getEnv('BOT_TOKEN', true),
  MONGODB_URI: getEnv('MONGODB_URI', true),
  RATE_LIMIT: getEnv('RATE_LIMIT', false, '5'),
  RATE_LIMIT_WINDOW: getEnv('RATE_LIMIT_WINDOW', false, '10s'),
} as const;
