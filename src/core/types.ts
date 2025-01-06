import { Context, Middleware, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

/**
 * Generic configuration type that enforces string or undefined values
 */
export type Config<T> = {
  [K in keyof T]: string | undefined;
};

/**
 * Command configuration options
 */
export interface CommandOptions {
  name: string;
  description: string;
}

/**
 * Command handler function type
 */
export type CommandHandler = (ctx: Context<Update>) => Promise<void>;

/**
 * Middleware handler function type
 */
export type MiddlewareHandler = Middleware<Context<Update>>;

/**
 * GwKang options
 */
export interface GwKangOptions {
  setMyCommands?: boolean;
  bot?: Partial<Telegraf.Options<Context<Update>>>;
}
