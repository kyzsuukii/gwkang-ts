import { createCommand } from '../utils/command';
import { invalidInput } from '../helper/errors';
import { CommandContext, Context } from 'grammy';
import { InputFile } from 'grammy/types';
import { ReplyParameters } from 'grammy/types';
import { downloadFileToTemp } from '../helper/io';
import { BotHelpers } from '../helper/strings';

const convertStickerToImage = async (ctx: CommandContext<Context>): Promise<void> => {
  let replyparam: ReplyParameters = {
    message_id: ctx.message?.message_id!,
  };

  const sticker = ctx.message?.reply_to_message?.sticker;
  if (!sticker) {
    await ctx.reply('Please reply to a sticker!', {
      reply_parameters: replyparam,
    });
    return;
  }

  try {
    // Get file path from Telegram
    const file = await ctx.api.getFile(sticker.file_id);
    if (!file.file_path) {
      await ctx.reply('Failed to get sticker file!', {
        reply_parameters: replyparam,
      });
      return;
    }

    // Download the sticker file
    const tempFile = await downloadFileToTemp(
      `https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`,
      BotHelpers.genRandomFileName(file.file_path)
    );

    // Send as photo
    await ctx.replyWithPhoto(new InputFile(tempFile), {
      reply_parameters: replyparam,
    });
  } catch (error) {
    await ctx.reply('Failed to convert sticker to image!', {
      reply_parameters: replyparam,
    });
  }
};

const toImageCommand = createCommand(
  {
    name: 'toimage',
    description: 'Convert a sticker to image',
  },
  async ctx => {
    if (ctx.message?.reply_to_message?.sticker) {
      await convertStickerToImage(ctx);
    } else {
      await invalidInput(ctx);
    }
  }
);

export default toImageCommand;
