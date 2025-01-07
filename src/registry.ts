import { rateLimit } from './middleware/rateLimit';
import { pingCommand } from './commands/ping';
import { startCommand } from './commands/start';
import { kangCommand } from './commands/kang';
import { debugCommand } from './commands/debug';
import { MiddlewareHandler } from './core/types';
import { Command } from './utils/command';

export const middlewares: MiddlewareHandler[] = [
  rateLimit,
  // Add more middlewares here
];

export const commands: Command[] = [
  pingCommand,
  startCommand,
  kangCommand,
  debugCommand
  // Add more commands here
];
