import { createCommand } from '../utils/command';
import { IUser } from '../models/user';

const start = createCommand(
  {
    name: 'start',
    description: 'Start the bot',
  },
  async ctx => {
    try {
      if (!ctx.from) {
        await ctx.reply('Error: Could not identify user');
        return;
      }

      const User = ctx.db.model<IUser>('User');
      if (!User) {
        throw new Error('User model not found');
      }

      const user = await User.findOne({ userId: ctx.from.id });
      if (!user) {
        await User.create({
          userId: ctx.from.id,
          username: ctx.from.username || undefined,
          firstName: ctx.from.first_name || undefined,
          lastName: ctx.from.last_name || undefined,
        });
        await ctx.reply('Welcome to the bot!');
      } else {
        await ctx.reply('Welcome back!');
      }
    } catch (error) {
      console.error('Error in start command:', error);
      await ctx.reply('An error occurred while starting the bot');
    }
  }
);

export default start;
