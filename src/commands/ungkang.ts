import { createCommand } from '../utils/command';
import { invalidInput } from '../helper/errors';
import { stickerpackStateModel } from '../models/stickerpackState';
import { CommandContext, Context } from 'grammy';
import { ReplyParameters } from 'grammy/types';

const removeStickerFromSet = async (ctx: CommandContext<Context>): Promise<void> => {
  let replyparam: ReplyParameters = {
    message_id: ctx.message?.message_id!,
  };

  // Check if user has a stickerpack
  const StickerpackStateDoc = await stickerpackStateModel.findOne({
    user_id: ctx.message?.from.id!,
  });

  if (!StickerpackStateDoc) {
    await ctx.reply("You don't have any active stickerpack!", {
      reply_parameters: replyparam,
    });
    return;
  }

  // Get the sticker file_id from replied message
  const stickerFileId = ctx.message?.reply_to_message?.sticker?.file_id;
  if (!stickerFileId) {
    await ctx.reply('Please reply to a sticker that you want to remove!', {
      reply_parameters: replyparam,
    });
    return;
  }

  try {
    // Remove the sticker from set
    await ctx.api.deleteStickerFromSet(stickerFileId);
    await ctx.reply('Sticker successfully removed from the pack!', {
      reply_parameters: replyparam,
    });
  } catch (error) {
    await ctx.reply('Failed to remove sticker from pack. Make sure you own this stickerpack!', {
      reply_parameters: replyparam,
    });
  }
};

const ungkangCommand = createCommand(
  {
    name: 'ungkang',
    description: 'Remove a sticker from your stickerpack',
  },
  async ctx => {
    if (ctx.message?.reply_to_message?.sticker) {
      await removeStickerFromSet(ctx);
    } else {
      await invalidInput(ctx);
    }
  }
);

export default ungkangCommand;
