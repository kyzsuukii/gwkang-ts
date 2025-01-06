/**
 * Type guard to check if a value is null or undefined
 */
export const isNullOrUndefined = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: unknown): boolean => {
  if (isNullOrUndefined(value)) return true;

  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value !== null && typeof value === 'object') return Object.keys(value).length === 0;

  return false;
};

/**
 * Gets empty keys from an object
 */
export const getEmptyKeys = (obj: Record<string, unknown>): string[] => {
  return Object.entries(obj)
    .filter(([_, value]) => isEmpty(value))
    .map(([key]) => key);
};
