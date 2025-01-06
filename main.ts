import { GwKang } from './src/core';
import { logger } from './src/utils/logger';

const main = async () => {
  logger.info('Initializing GwKang bot...');
  const gwKang = new GwKang({
    setMyCommands: false,
    bot: {
      handlerTimeout: 90_000,
    },
  });

  const bot = await gwKang.initialize();

  logger.info('Bot started successfully');

  await bot.launch({
    dropPendingUpdates: true,
    allowedUpdates: ['message', 'callback_query'],
  });

  bot.catch((error: unknown) => {
    logger.error('An error occurred:', error instanceof Error ? error.message : String(error));
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

main();
