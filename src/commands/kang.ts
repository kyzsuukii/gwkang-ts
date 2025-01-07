import { Command } from '../utils/command';
import { invalidInput } from '../helper/errors';
import { stickerpackStateModel } from '../models/stickerpackState';
import { CommandContext, Context } from 'grammy';
import { InputSticker } from 'grammy/types';
import { BotHelpers, IStickerpackData } from '../helper/strings';

const createNewStickerpack = async (ctx: CommandContext<Context>): Promise<IStickerpackData | null> => {
  let stickerData: IStickerpackData = await BotHelpers.genRandomStickerpackName(ctx);

  let input: InputSticker[] = [
    {
      sticker: ctx.message?.reply_to_message?.sticker?.file_id!,
      emoji_list: ["😈"], // test
      format: "static"
    }
  ]

  /* return true on success */
  let ret: boolean = await ctx.api.createNewStickerSet(
    ctx.message?.from.id!,
    stickerData.stickerName,
    stickerData.stickerTitle,
    input
  )

  if (ret == true) {
    return stickerData
  } else {
    return null
  }
}

const addStickerPack = async (ctx: CommandContext<Context>, prevName: string): Promise<boolean> => {

  let input: InputSticker = {
    sticker: ctx.message?.reply_to_message?.sticker?.file_id!,
    emoji_list: ["😈"], // test
    format: "static"
  }

  let ret: boolean = await ctx.api.addStickerToSet(
    ctx.message?.from.id!,
    prevName,
    input
  )

  return ret
}

export const kangCommand = Command.create(
  {
    name: 'kang',
    description: 'Kanging other user sticker',
  },
  async ctx => {
    if (ctx.message?.reply_to_message != undefined) {
      if (ctx.message.reply_to_message.sticker == undefined) {
        await invalidInput(ctx)
        return 0;
      }
    } else {
      await invalidInput(ctx)
      return 0;
    }

    /* 
      find current used sticker
    */
    const StickerpackStateDoc = await stickerpackStateModel.findOne({
      user_id: ctx.message.from.id
    })

    if (StickerpackStateDoc == undefined) {
      let ret: IStickerpackData | null = await createNewStickerpack(ctx)
      if (ret != null) {
        await ctx.reply(`Sticker pack created and <a href='https://t.me/addstickers/${ret.stickerName}'>Kanged!</a>`, {
          parse_mode: "HTML"
        })

        /* done with sticker, now insert previous created sticker to the db */
        let doc = new stickerpackStateModel({
          user_id: ctx.message.from.id,
          current: ret.stickerName
        })

        await doc.save()
      } else {
        await ctx.reply("kang failed")
      }

    } else {
      /* previous data is found */

      let ret: boolean = await addStickerPack(ctx, StickerpackStateDoc.current);
      if (!ret) {
        await ctx.reply("kang failed")
      } else {
        await ctx.reply(`New sticker <a href='https://t.me/addstickers/${StickerpackStateDoc.current}'>Kanged!</a>`, {
          parse_mode: "HTML"
        })
      }
    }
  }
);
