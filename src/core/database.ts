import mongoose from 'mongoose';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

export class Database {
  private static instance: Database;
  private client: mongoose.Connection;

  private constructor() {
    this.client = mongoose.connection;
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    await mongoose
      .connect(config.MONGODB_URI)
      .catch(err => {
        logger.error(err);
        process.exit(1);
      })
      .finally(() => {
        logger.info('Connected to MongoDB');
      });
  }

  getClient(): mongoose.Connection {
    return this.client;
  }
}
