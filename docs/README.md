# Quick Start Guide

## Table of Contents
- [Quick Start Guide](#quick-start-guide)
  - [Table of Contents](#table-of-contents)
  - [Bot Initialization](#bot-initialization)
  - [Registering Commands and Middlewares](#registering-commands-and-middlewares)
  - [Creating Commands](#creating-commands)
    - [Simple Command](#simple-command)
    - [Database Command](#database-command)
  - [Models](#models)
    - [User Model](#user-model)
    - [Creating Models](#creating-models)
  - [Database Operations](#database-operations)

## Bot Initialization
Initialize the bot with the following configuration:
```typescript
import { createBot } from './src/core/bot';

const main = async () => {
  const bot = await createBot({
    setMyCommands: true,
    bot: {
      client: {
        // Bot client options
      },
    },
  });

  await bot.start({
    // Start options
  });
};
```

## Registering Commands and Middlewares
Add your commands and middlewares to the registry:
```typescript
// Register middlewares, commands and models in registry.ts
export const middlewares = [
  rateLimit,
  // Add more middlewares here
];

export const commands = [
  ping,
  start,
  // Add more commands here
];

export const models = [
  model('User', UserSchema),
  // Add more models here
];
```

## Creating Commands
Commands are created using the `createCommand` function:

### Simple Command
Basic command without any special handling:
```typescript
import { createCommand } from '../utils/command';

const ping = createCommand(
  {
    name: 'ping',
    description: 'Check bot status',
  },
  async ctx => {
    const start = Date.now();
    await ctx.reply('Calculating ping...');
    const end = Date.now();
    await ctx.reply(`Pong! Response time: ${end - start}ms`);
  }
);

export default ping;
```

### Database Command
Command that interacts with the database:
```typescript
const start = createCommand(
  {
    name: 'start',
    description: 'Start the bot',
  },
  async ctx => {
    try {
      if (!ctx.from) {
        await ctx.reply('Error: Could not identify user');
        return;
      }

      const User = ctx.db.model<IUser>('User');
      const user = await User.findOne({ userId: ctx.from.id });
      
      if (!user) {
        await User.create({
          userId: ctx.from.id,
          username: ctx.from.username || undefined,
          firstName: ctx.from.first_name || undefined,
          lastName: ctx.from.last_name || undefined,
        });
        await ctx.reply('Welcome to the bot!');
      } else {
        await ctx.reply('Welcome back!');
      }
    } catch (error) {
      console.error('Error in start command:', error);
      await ctx.reply('An error occurred');
    }
  }
);
```

## Models

### User Model
The built-in User model for tracking bot users:
```typescript
interface IUser extends Document {
  userId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
```

### Creating Models
Example of creating a custom model:
```typescript
const customSchema = new Schema({
  field: { type: String, required: true },
  // Add more fields
}, {
  timestamps: true
});

// Register in registry.ts
export const models = [
  model('Custom', customSchema),
  // Other models
];
```

## Database Operations
Common database operations using Mongoose:
```typescript
// Create
const doc = await Model.create({ field: value });

// Read
const docs = await Model.find({ field: value });
const doc = await Model.findOne({ field: value });

// Update
await Model.updateOne(
  { field: value },
  { $set: { updatedField: newValue } }
);

// Delete
await Model.deleteOne({ field: value });

// Pagination
const docs = await Model.find()
  .skip((page - 1) * perPage)
  .limit(perPage);

// Sorting
const docs = await Model.find().sort({ createdAt: -1 });

// Complex Query
const docs = await Model.find({
  field1: { $gt: value },
  field2: { $in: arrayOfValues },
  field3: /pattern/i
});

// Aggregation
const results = await Model.aggregate([
  { $match: { field: value } },
  { $group: { _id: '$groupField', total: { $sum: 1 } } }
]);
``` 