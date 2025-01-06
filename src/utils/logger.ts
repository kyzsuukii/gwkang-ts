import kleur from 'kleur';
import { format } from 'date-fns';

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

const logger: Logger = {
  level: LogLevel.INFO,

  error: (...args: LogArgs): void => {
    if (logger.level >= LogLevel.ERROR) {
      console.error(
        kleur.red().bold('error') +
          kleur.white(` [${getTimestamp()}]`) +
          kleur.red(` › ${args.join(' ')}`)
      );
    }
  },

  warn: (...args: LogArgs): void => {
    if (logger.level >= LogLevel.WARN) {
      console.warn(
        kleur.yellow().bold('warn') +
          kleur.white(` [${getTimestamp()}]`) +
          kleur.yellow(` › ${args.join(' ')}`)
      );
    }
  },

  info: (...args: LogArgs): void => {
    if (logger.level >= LogLevel.INFO) {
      console.info(
        kleur.cyan().bold('info') +
          kleur.white(` [${getTimestamp()}]`) +
          kleur.cyan(` › ${args.join(' ')}`)
      );
    }
  },

  debug: (...args: LogArgs): void => {
    if (logger.level >= LogLevel.DEBUG) {
      console.debug(
        kleur.gray().bold('debug') +
          kleur.white(` [${getTimestamp()}]`) +
          kleur.gray(` › ${args.join(' ')}`)
      );
    }
  },

  setLevel: (level: LogLevel): void => {
    logger.level = level;
  },
};

export { logger, LogLevel };
