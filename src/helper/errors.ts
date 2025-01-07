import { CommandContext, Context } from "grammy"

const invalidInput = async (ctx: CommandContext<Context>) => {
        await ctx.reply("the input is invalid, you need to reply to a sticker");
}

export {
        invalidInput
}