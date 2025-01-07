import rateLimit from './middleware/rateLimit';
import ping from './commands/ping';
import start from './commands/start';
import kang from './commands/kang';
import debug from './commands/debug';
import { MiddlewareHandler, CommandHandler } from './core/types';
import { model } from 'mongoose';
import { UserSchema } from './models/user';
import ungkang from './commands/ungkang';
import toImage from './commands/toimage';

export const middlewares: MiddlewareHandler[] = [
  rateLimit,
  // Add more middlewares here
];

export const commands: CommandHandler[] = [
  ping,
  start,
  kang,
  debug,
  toImage,
  ungkang,
  // Add more commands here
];

export const models = [
  model('User', UserSchema),
  // Add more models here
];
