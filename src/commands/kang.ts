import { createCommand } from '../utils/command';
import { invalidInput } from '../helper/errors';
import { stickerpackStateModel } from '../models/stickerpackState';
import { CommandContext, Context } from 'grammy';
import { InputFile, InputSticker, Message } from 'grammy/types';
import { BotHelpers, IStickerpackData } from '../helper/strings';
import { downloadFileToTemp } from '../helper/io';
import sharp from 'sharp';
import { ReplyParameters } from 'grammy/types';

const createNewStickerpack = async (
  ctx: CommandContext<Context>,
  stickerFileId: string
): Promise<IStickerpackData | null> => {
  let stickerData: IStickerpackData = await BotHelpers.genRandomStickerpackName(ctx);

  let input: InputSticker[] = [
    {
      sticker: stickerFileId!,
      emoji_list: ['😈'], // test
      format: 'static',
    },
  ];

  /* return true on success */
  let ret: boolean = await ctx.api.createNewStickerSet(
    ctx.message?.from.id!,
    stickerData.stickerName,
    stickerData.stickerTitle,
    input
  );

  if (ret == true) {
    return stickerData;
  } else {
    return null;
  }
};

const addStickerPack = async (
  ctx: CommandContext<Context>,
  prevName: string,
  stickerFileId: string
): Promise<boolean> => {
  let input: InputSticker = {
    sticker: stickerFileId!,
    emoji_list: ['😈'], // test
    format: 'static',
  };

  let ret: boolean = await ctx.api.addStickerToSet(ctx.message?.from.id!, prevName, input);

  return ret;
};

const kangFromSticker = async (ctx: CommandContext<Context>): Promise<void> => {
  /* setup reply id */
  let replyparam: ReplyParameters = {
    message_id: ctx.message?.message_id!,
  };

  /* 
      find current used sticker
    */

  const StickerpackStateDoc = await stickerpackStateModel.findOne({
    user_id: ctx.message?.from.id!,
  });

  if (StickerpackStateDoc == undefined) {
    let ret: IStickerpackData | null = await createNewStickerpack(
      ctx,
      ctx.message?.reply_to_message?.sticker?.file_id!
    );

    if (ret != null) {
      await ctx.reply(
        `Sticker pack created and <a href='https://t.me/addstickers/${ret.stickerName}'>Kanged!</a>`,
        {
          parse_mode: 'HTML',
          reply_parameters: replyparam,
        }
      );

      /* done with sticker, now insert previous created sticker to the db */
      let doc = new stickerpackStateModel({
        user_id: ctx.message?.from.id!,
        current: ret.stickerName,
      });

      await doc.save();
    } else {
      await ctx.reply('kang failed', {
        reply_parameters: replyparam,
      });
    }
  } else {
    /* previous data is found */

    let ret: boolean = await addStickerPack(
      ctx,
      StickerpackStateDoc.current,
      ctx.message?.reply_to_message?.sticker?.file_id!
    );

    if (!ret) {
      await ctx.reply('kang failed', {
        reply_parameters: replyparam,
      });
    } else {
      await ctx.reply(
        `New sticker <a href='https://t.me/addstickers/${StickerpackStateDoc.current}'>Kanged!</a>`,
        {
          reply_parameters: replyparam,
          parse_mode: 'HTML',
        }
      );
    }
  }
};

/**
 * return image path of resized image
 *
 * @param fileName
 */
const processImage = async (fileName: string): Promise<string> => {
  const imgctx = await sharp(fileName).metadata();

  let width: number = imgctx.width!;
  let height: number = imgctx.height!;

  let new_width = 0;
  let new_height = 0;

  if (width > height) {
    new_width = 512;
    new_height = Math.floor((512 / width) * height);
  } else {
    new_height = 512;
    new_width = Math.floor((512 / height) * width);
  }

  let outImage: string = `/tmp/${BotHelpers.genRandomFileName(fileName)}`;

  await sharp(fileName).resize(new_width, new_height).toFile(outImage);

  return outImage;
};

const kangFromImage = async (ctx: CommandContext<Context>): Promise<void> => {
  /* setup reply id */
  let replyparam: ReplyParameters = {
    message_id: ctx.message?.message_id!,
  };

  /* send sticker first */

  const largestphoto = await ctx.message?.reply_to_message?.photo?.pop();
  const file = await ctx.api.getFile(largestphoto?.file_id!);

  let tempData = await downloadFileToTemp(
    `https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`,
    BotHelpers.genRandomFileName(file.file_path!)
  );

  let resizedImage = await processImage(tempData);

  let sentSticker: Message = await ctx.api.sendSticker(
    ctx.message?.chat.id!,
    new InputFile(resizedImage)
  );

  const StickerpackStateDoc = await stickerpackStateModel.findOne({
    user_id: ctx.message?.from.id!,
  });

  if (StickerpackStateDoc == undefined) {
    let ret: IStickerpackData | null = await createNewStickerpack(
      ctx,
      sentSticker.sticker?.file_id!
    );

    if (ret != null) {
      await ctx.reply(
        `Sticker pack created and <a href='https://t.me/addstickers/${ret.stickerName}'>Kanged!</a>`,
        {
          parse_mode: 'HTML',
          reply_parameters: replyparam,
        }
      );

      /* done with sticker, now insert previous created sticker to the db */
      let doc = new stickerpackStateModel({
        user_id: ctx.message?.from.id!,
        current: ret.stickerName,
      });

      await doc.save();
    } else {
      await ctx.reply('kang failed', {
        reply_parameters: replyparam,
      });
    }
  } else {
    /* previous data is found */

    let ret: boolean = await addStickerPack(
      ctx,
      StickerpackStateDoc.current,
      sentSticker.sticker?.file_id!
    );
    if (!ret) {
      await ctx.reply('kang failed');
    } else {
      await ctx.reply(
        `New sticker <a href='https://t.me/addstickers/${StickerpackStateDoc.current}'>Kanged!</a>`,
        {
          parse_mode: 'HTML',
          reply_parameters: replyparam,
        }
      );
    }
  }
};

const kangCommand = createCommand(
  {
    name: 'kang',
    description: 'Kanging other user sticker',
  },
  async ctx => {
    if (ctx.message?.reply_to_message == undefined) {
      await invalidInput(ctx);
    } else {
      if (
        ctx.message?.reply_to_message?.sticker! != undefined &&
        ctx.message?.reply_to_message?.photo == undefined
      ) {
        await kangFromSticker(ctx);
      } else if (
        ctx.message?.reply_to_message?.photo != undefined &&
        ctx.message?.reply_to_message?.sticker == undefined
      ) {
        await kangFromImage(ctx);
      } else {
        await invalidInput(ctx);
      }
    }
  }
);

export default kangCommand;
