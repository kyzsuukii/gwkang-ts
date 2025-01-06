import { Telegraf } from 'telegraf';
import { config } from '../utils/config';
import { Database } from './database';
import { middlewares, commands } from '../registry';
import { logger } from '../utils/logger';
import { GwKangOptions } from './types';

export class GwKang {
  private bot: Telegraf;
  private db: Database;
  private options: GwKangOptions;

  constructor(options: GwKangOptions = {}) {
    this.options = options;
    this.bot = new Telegraf(config.BOT_TOKEN, options.bot);
    this.db = Database.getInstance();
  }

  private async setupCommands(): Promise<void> {
    if (this.options.setMyCommands) {
      try {
        await this.bot.telegram.setMyCommands(
          commands.map(cmd => ({
            command: cmd.name,
            description: cmd.description,
          }))
        );
        logger.info('Successfully registered bot commands with Telegram API');
      } catch (error) {
        logger.warn(
          'Failed to register bot commands with Telegram API. auto-completion will not work'
        );
        // continue even if the command registration fails
      }
    }
  }

  private async setupMiddlewares(): Promise<void> {
    commands.forEach(command => command.register(this.bot));
    middlewares.forEach(middleware => this.bot.use(middleware));
    logger.info('Successfully registered all command handlers and middlewares');
  }

  private async initializeDatabase(): Promise<void> {
    await this.db.connect();
    logger.info('Successfully established database connection');
  }

  async initialize(): Promise<Telegraf> {
    await this.initializeDatabase();
    await this.setupMiddlewares();
    await this.setupCommands();
    logger.info('Bot initialization completed. waiting until bot is started...');
    return this.bot;
  }
}
