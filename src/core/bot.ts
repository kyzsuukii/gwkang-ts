import { Bot, Context } from 'grammy';
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
    this.setupErrorHandler();
  }

  private setupErrorHandler(): void {
    this.bot.catch(err => {
      logger.error('Telegram bot error:', err instanceof Error ? err.message : String(err));
    });
  }

  private async setupCommands(): Promise<void> {
    if (this.options.setMyCommands) {
      await this.bot.api.setMyCommands(
        commands.map(cmd => ({
          command: cmd.name,
          description: cmd.description,
        }))
      );
      logger.info('Successfully registered bot commands with Telegram API');
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
    logger.info('Bot initialization completed - ready to handle updates');
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
