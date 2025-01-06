import { config as rawConfig, Env } from '../utils/config';

type ValueType = 'string' | 'number' | 'boolean';

type EnvTypes = {
  [K in keyof Env]: Env[K] extends number
    ? 'number'
    : Env[K] extends boolean
      ? 'boolean'
      : 'string';
};

class ConfigValidator {
  private static instance: ConfigValidator;
  private validatedConfig: Env;

  private constructor() {
    this.validatedConfig = this.validateAndTransform();
  }

  private transformValue(key: keyof Env, value: string | undefined): any {
    if (!value) {
      throw new Error(`${String(key)} is required but not provided`);
    }

    const targetType = this.getTargetType(key);
    switch (targetType) {
      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          throw new Error(`${String(key)} must be a valid number`);
        }
        return num;
      case 'boolean':
        return value.toLowerCase() === 'true';
      case 'string':
        return value;
      default:
        throw new Error(`Unknown type for ${String(key)}`);
    }
  }

  private getTargetType<K extends keyof Env>(key: K): ValueType {
    type ValueOf<T> = T[keyof T];
    type EnvValue = ValueOf<Env>;

    const value = {} as Env[K];
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    return 'string';
  }

  private validateAndTransform(): Env {
    const validated: Partial<Env> = {};

    for (const key of Object.keys(rawConfig) as Array<keyof Env>) {
      validated[key] = this.transformValue(key, rawConfig[key]);
    }

    return validated as Env;
  }

  static getInstance(): ConfigValidator {
    if (!ConfigValidator.instance) {
      ConfigValidator.instance = new ConfigValidator();
    }
    return ConfigValidator.instance;
  }

  get config(): Env {
    return this.validatedConfig;
  }
}

export const config = ConfigValidator.getInstance().config;
