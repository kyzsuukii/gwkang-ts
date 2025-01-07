import kleur from 'kleur';
import { format } from 'date-fns';
import { getEnv } from './env';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

type LogArgs = Array<string | number | boolean | object | Error>;

interface Logger {
  level: LogLevel;
  error: (...args: LogArgs) => void;
  warn: (...args: LogArgs) => void;
  info: (...args: LogArgs) => void;
  debug: (...args: LogArgs) => void;
  setLevel: (level: LogLevel) => void;
}

function getTimestamp(): string {
  return format(new Date(), 'HH:mm:ss');
}

const isProd = getEnv('NODE_ENV', false, 'development') === 'production';

function formatArgsAsString(args: LogArgs): string {
  return args.map(arg => {
    if (arg instanceof Error) {
      return arg.stack || arg.message;
    }
    if (typeof arg === 'object') {
      return JSON.stringify(arg);
    }
    return String(arg);
  }).join(' ');
}

const logger: Logger = {
  level: LogLevel.INFO,

  error: (...args: LogArgs): void => {
    if (logger.level >= LogLevel.ERROR) {
      if (isProd) {
        console.error(JSON.stringify({
          level: 'error',
          timestamp: getTimestamp(),
          message: formatArgsAsString(args)
        }));
      } else {
        console.error(
          kleur.red().bold('error') +
            kleur.white(` [${getTimestamp()}]`) +
            kleur.red(` › ${args.join(' ')}`)
        );
      }
    }
  },

  warn: (...args: LogArgs): void => {
    if (logger.level >= LogLevel.WARN) {
      if (isProd) {
        console.warn(JSON.stringify({
          level: 'warn',
          timestamp: getTimestamp(),
          message: formatArgsAsString(args)
        }));
      } else {
        console.warn(
          kleur.yellow().bold('warn') +
            kleur.white(` [${getTimestamp()}]`) +
            kleur.yellow(` › ${args.join(' ')}`)
        );
      }
    }
  },

  info: (...args: LogArgs): void => {
    if (logger.level >= LogLevel.INFO) {
      if (isProd) {
        console.info(JSON.stringify({
          level: 'info',
          timestamp: getTimestamp(),
          message: formatArgsAsString(args)
        }));
      } else {
        console.info(
          kleur.cyan().bold('info') +
            kleur.white(` [${getTimestamp()}]`) +
            kleur.cyan(` › ${args.join(' ')}`)
        );
      }
    }
  },

  debug: (...args: LogArgs): void => {
    if (logger.level >= LogLevel.DEBUG) {
      if (isProd) {
        console.debug(JSON.stringify({
          level: 'debug',
          timestamp: getTimestamp(),
          message: formatArgsAsString(args)
        }));
      } else {
        console.debug(
          kleur.gray().bold('debug') +
            kleur.white(` [${getTimestamp()}]`) +
            kleur.gray(` › ${args.join(' ')}`)
        );
      }
    }
  },

  setLevel: (level: LogLevel): void => {
    logger.level = level;
  },
};

export { logger, LogLevel };
