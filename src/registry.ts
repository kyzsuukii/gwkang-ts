import rateLimit from './middleware/rateLimit';
import ping from './commands/ping';
import start from './commands/start';
import * as T from './core/types';
import { Command } from './utils/command';

export const middlewares: T.MiddlewareHandler[] = [
  rateLimit(),
  // Add more middlewares here
];

export const commands: Command[] = [
  ping(),
  start(),
  // Add more commands here
];
