import { Bot } from 'grammy';
import { CommandOptions, CommandHandler, Context, CommandMetadata } from '../core/types';

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

export function registerCommands(bot: Bot<Context>): void {
  for (const [name, metadata] of commands) {
    bot.command(name, ctx => metadata.handler(ctx));
  }
}

export function getCommands(): Map<string, CommandMetadata> {
  return commands;
}
