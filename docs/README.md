# GwKang Bot Documentation

## Table of Contents
- [Registering Commands and Middlewares](#registering-commands-and-middlewares)
- [Creating a Middleware](#creating-a-middleware)
- [Creating Commands](#creating-commands)
  - [Simple Command](#simple-command)
  - [Database Command](#database-command)
  - [Command with Subcommands](#command-with-subcommands)
- [Database Usage](#database-usage)
  - [Creating Models](#creating-models)
  - [Database Operations](#database-operations)

## Registering Commands and Middlewares
Add your commands and middlewares to the registry:
```typescript
// Register middlewares and commands in registry.ts
export const middlewares = [
  rateLimit,
  // Add more middlewares here
];

export const commands = [
  startCommand,
  pingCommand,
  // Add more commands here
];
```

## Creating a Middleware
Example of creating a rate limit middleware:
```typescript
// Simple rate limit middleware
export function rateLimit() {
  const requests = new Map<number, number>();
  
  return async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return next();

    const now = Date.now();
    const lastRequest = requests.get(userId) || 0;
    
    if (now - lastRequest < 1000) {
      return ctx.reply('Please wait before sending another command');
    }
    
    requests.set(userId, now);
    return next();
  };
}
```

## Creating Commands

### Simple Command
Basic command without any special handling:
```typescript
export const pingCommand = Command.create(
  {
    name: 'ping',
    description: 'Check bot status',
  },
  async ctx => {
    await ctx.reply('Pong!');
  }
);
```

### Database Command
Command that interacts with the database:
```typescript
export const noteCommand = Command.create(
  {
    name: 'note',
    description: 'Save a note',
  },
  async ctx => {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    if (!text) return ctx.reply('Usage: /note <your note>');

    try {
      const note = new Note({
        userId: ctx.from.id,
        content: text,
      });
      await note.save();
      await ctx.reply('Note saved!');
    } catch (error) {
      logger.error('Failed to save note:', error);
      await ctx.reply('Failed to save note');
    }
  }
);
```

### Command with Subcommands
Command that handles multiple subcommands:
```typescript
export const settingsCommand = Command.create(
  {
    name: 'settings',
    description: 'Manage settings',
  },
  async ctx => {
    const [subcommand, ...args] = ctx.message.text.split(' ').slice(1);
    
    try {
      switch (subcommand) {
        case 'view': {
          const settings = await Settings.findOne({ userId: ctx.from.id });
          if (!settings) return ctx.reply('No settings found');
          await ctx.reply(JSON.stringify(settings, null, 2));
          break;
        }
        case 'set': {
          const [key, value] = args;
          if (!key || !value) return ctx.reply('Usage: /settings set <key> <value>');
          
          await Settings.updateOne(
            { userId: ctx.from.id },
            { $set: { [key]: value } },
            { upsert: true }
          );
          await ctx.reply('Settings updated!');
          break;
        }
        default:
          await ctx.reply(
            '/settings view - View settings\n' +
            '/settings set <key> <value> - Update setting'
          );
      }
    } catch (error) {
      logger.error('Settings command error:', error);
      await ctx.reply('Failed to process settings command');
    }
  }
);
```

## Database Usage

### Creating Models
Example of creating a database model:
```typescript
const noteSchema = new Schema({
  userId: { type: Number, required: true, index: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Note = model('Note', noteSchema);
```

### Database Operations
Common database operations:
```typescript
// Create
const doc = new YourModel({ field1: value1 });
await doc.save();

// Read
const docs = await YourModel.find({ field: value });
const doc = await YourModel.findOne({ field: value });

// Update
await YourModel.updateOne(
  { field: value },
  { $set: { updatedField: newValue } }
);

// Delete
await YourModel.deleteOne({ field: value });

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