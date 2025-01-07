import { Bot } from 'grammy';
import { CommandOptions, CommandHandler, Context, CommandMetadata } from '../core/types';
import { logger } from './logger';

const commands = new Map<string, CommandMetadata>();

export function createCommand(options: CommandOptions, handler: CommandHandler): CommandHandler {
  const metadata: CommandMetadata = {
    name: options.name,
    description: options.description,
    handler,
  };

  commands.set(options.name, metadata);
  return handler;
}

export async function registerCommands(bot: Bot<Context>): Promise<void> {
  for (const [name, metadata] of commands) {
    bot.command(name, ctx => metadata.handler(ctx));
  }
  logger.info('Successfully registered command handlers');
}

export function getCommands(): Map<string, CommandMetadata> {
  return commands;
}
