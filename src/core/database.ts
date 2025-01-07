import mongoose from 'mongoose';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { Context } from './types';
import { Middleware } from 'grammy';
import { models } from '../registry';

interface Database {
  client: mongoose.Connection;
  middleware: Middleware<Context>;
}

let dbInstance: Database | null = null;

export async function connectDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  await mongoose.connect(config.MONGODB_URI).catch(err => {
    logger.error(err);
    process.exit(1);
  });

  // Register all models
  models.forEach(model => {
    const modelName = model.modelName;
    if (!mongoose.models[modelName]) {
      mongoose.model(modelName, model.schema);
    }
  });

  logger.info('Connected to MongoDB and registered all models');

  dbInstance = {
    client: mongoose.connection,
    middleware: async (ctx: Context, next) => {
      ctx.db = mongoose.connection;
      await next();
    },
  };

  return dbInstance;
}
