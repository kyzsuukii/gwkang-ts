import { GwKang } from './src/core';
import { logger } from './src/utils/logger';

const main = async () => {
  const gwKang = new GwKang({
    /**
     * Set to false if you encounter "Network request for 'setMyCommands' failed" error.
     * Note: This will disable bot command autocompletion on typing slash (/) in Telegram.
     */
    setMyCommands: true,
    bot: {
      // grammy bot options
    },
  });
  logger.info('Initializing GwKang bot...');
  const bot = await gwKang.initialize();

  logger.info('Starting GwKang bot...');
  await bot.start({
    onStart: () => {
      logger.info('Bot started successfully');
    },
  });
};

main();
