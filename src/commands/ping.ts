import { Command } from '../utils/command';

export default function ping(): Command {
  return Command.create(
    {
      name: 'ping',
      description: 'Check if bot is alive',
    },
    async ctx => {
      const start = Date.now();
      await ctx.reply('Pinging...');
      const end = Date.now();
      await ctx.reply(`Pong! Response time: ${end - start}ms`);
    }
  );
}
