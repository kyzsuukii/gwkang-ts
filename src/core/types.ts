import { Context, Middleware, CommandMiddleware, BotConfig } from 'grammy';

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
export type CommandHandler = CommandMiddleware<Context>;

/**
 * Middleware handler function type
 */
export type MiddlewareHandler = Middleware<Context>;

/**
 * GwKang options
 */
export interface GwKangOptions {
  setMyCommands?: boolean;
  bot?: BotConfig<Context>;
}
