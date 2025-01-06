import { Bot, Context } from 'grammy';
import { Database, GwKang } from './src/core';
import { logger } from './src/utils/logger';

let bot: Bot<Context>;

const shutdown = async (): Promise<void> => {
  try {
    if (bot.isRunning()) {
      logger.info('Shutting down bot...');
      await bot.stop();
      Database.getInstance().getClient().close();
    }
  } catch (e) {
    logger.error(`Error during shutdown: ${e instanceof Error ? e.message : e}`);
  } finally {
    process.exit(1);
  }
};

const initializeBot = async (): Promise<Bot<Context>> => {
  const gwKang = new GwKang({
    setMyCommands: true,
    bot: {
      client: {
        timeoutSeconds: 10,
      },
    },
  });
  logger.info('Initializing GwKang bot...');
  return await gwKang.initialize();
};

const startBot = async (bot: Bot<Context>): Promise<void> => {
  logger.info('Starting GwKang bot...');
  await bot.start({
    onStart: () => logger.info('Bot started'),
    drop_pending_updates: true,
    allowed_updates: ['message', 'callback_query'],
  });

  bot.catch(err => {
    logger.error(`Bot error: ${err instanceof Error ? err.message : err}`);
    shutdown();
  });
};

const main = async () => {
  try {
    bot = await initializeBot();
    await startBot(bot);
  } catch (e) {
    logger.error(`Error during initialization: ${e instanceof Error ? e.message : e}`);
    await shutdown();
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

main();
