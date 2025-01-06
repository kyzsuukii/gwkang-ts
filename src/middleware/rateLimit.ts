import ms from 'ms';
import { MiddlewareHandler } from '../core';
import { config } from '../utils/config';

const rateLimits = new Map<string, { count: number; resetTime: number }>();

export const rateLimit: MiddlewareHandler = (): MiddlewareHandler => async (ctx, next) => {
  const userId = ctx.from?.id;
  const chatId = ctx.chat?.id;

  if (!userId || !chatId) return next();

  const rateLimitKey = `${chatId}:${userId}`;
  const now = Date.now();
  const limit = parseInt(config.RATE_LIMIT);
  const windowMs = ms(config.RATE_LIMIT_WINDOW);

  const userLimit = rateLimits.get(rateLimitKey);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimits.set(rateLimitKey, {
      count: 1,
      resetTime: now + windowMs,
    });
    return next();
  }

  if (userLimit.count >= limit) {
    const timeLeft = Math.ceil((userLimit.resetTime - now) / 1000);
    await ctx.reply(`Rate limit exceeded. Please wait ${timeLeft} seconds.`);
    return;
  }

  userLimit.count++;
  rateLimits.set(rateLimitKey, userLimit);

  return next();
};
