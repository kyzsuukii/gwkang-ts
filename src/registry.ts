import rateLimit from './middleware/rateLimit';
import ping from './commands/ping';
import start from './commands/start';
import { MiddlewareHandler, CommandHandler } from './core/types';
import { model } from 'mongoose';
import { UserSchema } from './models/user';

export const middlewares: MiddlewareHandler[] = [
  rateLimit,
  // Add more middlewares here
];

export const commands: CommandHandler[] = [
  ping,
  start,
  // Add more commands here
];

export const models = [
  model('User', UserSchema),
  // Add more models here
];
