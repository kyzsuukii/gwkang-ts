import { CommandContext, Context } from 'grammy';
import path from 'path';

export interface IStickerpackData {
  stickerTitle: string;
  stickerName: string;
}

export class BotHelpers extends String {
  private static unix(): number {
    return Date.now();
  }

  /**
   * Returns formatted sticker title and sticker name.
   *
   * @param ctx - a context from caller
   * @returns promise of IStickerpackData, which contained sticker title and sticker name respectively
   *
   * @beta
   */
  public static async genRandomStickerpackName(
    ctx: CommandContext<Context>
  ): Promise<IStickerpackData> {
    let currentTime: number = this.unix();

    let myUsername = await ctx.api.getMe();

    let data: IStickerpackData = {} as IStickerpackData;

    if (ctx.message?.sender_chat != undefined) {
      data.stickerTitle = `Sticker ${ctx.message.sender_chat.title}`;
      data.stickerName = `a${ctx.message.sender_chat.id}_on_${currentTime}_by_${myUsername.username}`;

      return data;
    }

    /* 
    handle user doesn't have a last name
    */

    if (ctx.message?.from.last_name === undefined) {
      data.stickerTitle = `Sticker ${ctx.message?.from.first_name}`;
      data.stickerName = `a${ctx.message?.from.id}_on_${currentTime}_by_${myUsername.username}`;
    } else {
      data.stickerTitle = `Sticker ${ctx.message?.from.first_name} ${ctx.message?.from.last_name}`;
      data.stickerName = `a${ctx.message?.from.id}_on_${currentTime}_by_${myUsername.username}`;
    }

    return data;
  }

  public static genRandomFileName(str: string): string {
    let ext: string = path.extname(str);
    let random: string = (Math.random() + 1).toString(36).substring(7);

    return `${random}${ext}`;
  }
}
