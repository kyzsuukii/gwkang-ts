import { Context as BaseContext, Middleware, BotConfig, CommandContext } from 'grammy';
import { Connection, Document } from 'mongoose';

/**
 * Base model interface for all database models
 */
export interface BaseModel extends Document {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Command configuration options
 */
export interface CommandOptions {
  name: string;
  description: string;
}

/**
 * Command metadata interface
 */
export interface CommandMetadata {
  name: string;
  description: string;
  handler: CommandHandler;
}

/**
 * GwKang Context interface
 */
export interface GwContext {
  db: Connection;
}

/**
 * Extended Context type with GwKang features
 */
export type Context = BaseContext & GwContext;

/**
 * Command handler function type
 */
export type CommandHandler = (ctx: CommandContext<Context>) => Promise<void> | void;

/**
 * Middleware handler function type
 */
export type MiddlewareHandler = Middleware<Context>;

/**
 * Bot client configuration
 */

/**
 * GwKang options
 */
export interface GwKangOptions {
  setMyCommands?: boolean;
  bot?: BotConfig<Context>;
}
