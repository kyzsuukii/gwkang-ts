import 'dotenv/config';

const isEmpty = (value: string | undefined | null): boolean => {
  return !value || value.trim().length === 0;
};

function getEnv(key: string, required: true): string;
function getEnv(key: string, required: false, defaultValue: string): string;
function getEnv(key: string, required?: false): string | undefined;
function getEnv(key: string, required = false, defaultValue?: string): string | undefined {
  const value = process.env[key];
  if (required && isEmpty(value)) {
    throw new Error(`Required environment variable ${key} is missing`);
  }
  return isEmpty(value) ? defaultValue : value;
}

export { getEnv };
