import { createCommand } from '../utils/command';

const ping = createCommand(
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

export default ping;
