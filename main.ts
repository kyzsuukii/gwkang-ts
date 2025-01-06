import { GwKang } from './src/core';
import { logger } from './src/utils/logger';

const main = async () => {
  const gwKang = new GwKang({
    setMyCommands: true,
    bot: {
      client: {
        timeoutSeconds: 10,
      },
    },
  });
  logger.info('Initializing GwKang bot...');
  const bot = await gwKang.initialize();

  logger.info('Starting GwKang bot...');
  await bot.start({
    onStart: () => logger.info('Bot started'),
    drop_pending_updates: true,
    allowed_updates: ['message', 'callback_query'],
  });
};

main();
