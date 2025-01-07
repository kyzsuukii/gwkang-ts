import { createBot } from './src/core/bot';
import { logger } from './src/utils/logger';

const main = async () => {
  logger.info('Initializing GwKang bot...');
  const bot = await createBot({
    setMyCommands: true,
  });

  logger.info('Starting GwKang bot...');
  await bot.start({
    onStart: () => logger.info('Bot started'),
    drop_pending_updates: true,
    allowed_updates: ['message', 'callback_query'],
  });
};

main();
