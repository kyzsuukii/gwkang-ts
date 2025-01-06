import { Command } from '../utils/command';
import { logger } from '../utils/logger';

export default function start(): Command {
  return Command.create(
    {
      name: 'start',
      description: 'Start the bot',
    },
    async ctx => {
      logger.debug('Start command received', {
        from: ctx.from,
        chat: ctx.chat,
        message: ctx.message,
      });
      const username = ctx.from?.first_name || 'there';
      try {
        await ctx.reply(`👋 Hello ${username}!\n\nI'm Just a bot, nothing more.`);
        logger.debug('Start command reply sent successfully');
      } catch (error) {
        logger.error(
          'Error sending start command reply:',
          error instanceof Error ? error : String(error)
        );
      }
    }
  );
}
