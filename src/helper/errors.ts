import { CommandContext, Context } from 'grammy';
import { ReplyParameters } from 'grammy/types';

const invalidInput = async (ctx: CommandContext<Context>) => {
  /* setup reply id */
  let replyparam: ReplyParameters = {
    message_id: ctx.message?.message_id!,
  };

  await ctx.reply('the input is invalid, you need to reply to a sticker', {
    reply_parameters: replyparam,
  });
};

export { invalidInput };
