import { Bot, Context } from 'grammy';
import { CommandOptions, CommandHandler } from '../core';

export class Command {
  constructor(
    public name: string,
    public description: string,
    public handler: CommandHandler
  ) {}

  static create(options: CommandOptions, handler: CommandHandler): Command {
    return new Command(options.name, options.description, handler);
  }

  register(bot: Bot<Context>) {
    bot.command(this.name, this.handler);
  }
}
