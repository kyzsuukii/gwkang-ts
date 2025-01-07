import { Command } from '../utils/command';
import { CommandContext, Context } from 'grammy';

export const debugCommand = Command.create(
  {
    name: 'debug',
    description: 'send the json',
  },
  async ctx => {

    /* repack the obj and remove the token */
    let jsonObj: any = JSON.parse(JSON.stringify(ctx, null, 2));
    jsonObj.api.token = "--"
    
    let jsonStr: any = JSON.stringify(jsonObj, null, 2);
    await ctx.reply(jsonStr)
  }
);
