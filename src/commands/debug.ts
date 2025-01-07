import { createCommand } from '../utils/command';
import { ReplyParameters } from 'grammy/types';

const debugCommand = createCommand(
  {
    name: 'debug',
    description: 'send the json',
  },
  async ctx => {
    let jsonStr: any = JSON.stringify(ctx.message, null, 4);

    let replyparam: ReplyParameters = {
      message_id: ctx.message?.message_id!
    }
    
    await ctx.reply(jsonStr, {
      reply_parameters: replyparam
    })
  }
);


export default debugCommand