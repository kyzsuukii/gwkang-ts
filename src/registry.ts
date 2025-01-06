import { rateLimit } from './middleware/rateLimit';
import { pingCommand } from './commands/ping';
import { startCommand } from './commands/start';
import { MiddlewareHandler } from './core/types';
import { Command } from './utils/command';

export const middlewares: MiddlewareHandler[] = [
  rateLimit,
  // Add more middlewares here
];

export const commands: Command[] = [
  pingCommand,
  startCommand,
  // Add more commands here
];
