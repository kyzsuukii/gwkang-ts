import rateLimit from './middleware/rateLimit';
import ping from './commands/ping';
import start from './commands/start';
import kangCommand from './commands/kang';
import debugCommand from './commands/debug';
import { MiddlewareHandler, CommandHandler } from './core/types';
import { model } from 'mongoose';
import { UserSchema } from './models/user';
import ungkangCommand from './commands/ungkang';
import toImageCommand from './commands/toimage';

export const middlewares: MiddlewareHandler[] = [
  rateLimit,
  // Add more middlewares here
];

export const commands: CommandHandler[] = [
  ping,
  start,
  kangCommand,
  debugCommand,
  toImageCommand,
  ungkangCommand,
  // Add more commands here
];

export const models = [
  model('User', UserSchema),
  // Add more models here
];
