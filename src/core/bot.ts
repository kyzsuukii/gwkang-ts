import { Bot, BotError, Context } from 'grammy';
import { config } from '../utils/config';
import { Database } from './database';
import { middlewares, commands } from '../registry';
import { getEmptyKeys } from '../utils/validation';
import { logger } from '../utils/logger';
import { GwKangOptions } from './types';

export class GwKang {
  private bot: Bot<Context>;
  private db: Database;
  private options: GwKangOptions;

  constructor(options: GwKangOptions = {}) {
    this.options = options;
    this.validateConfig();
    this.bot = new Bot<Context>(config.BOT_TOKEN as string, options.bot);
    this.db = Database.getInstance();
  }

  private async setupCommands(): Promise<void> {
    if (this.options.setMyCommands) {
      try {
        await this.bot.api.setMyCommands(
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

  async initialize(): Promise<Bot<Context>> {
    await this.initializeDatabase();
    await this.setupMiddlewares();
    await this.setupCommands();
    logger.info('Bot initialization completed. waiting until bot is started...');
    return this.bot;
  }

  private validateConfig(): void {
    const emptyKeys = getEmptyKeys(config);
    if (emptyKeys.length > 0) {
      const error = `Required environment variables missing: ${emptyKeys.join(', ')}`;
      logger.error(error);
      throw new Error(error);
    }
  }

  getDatabase(): Database {
    return this.db;
  }
}
