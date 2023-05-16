import { ValidateIf, ValidationOptions } from 'class-validator';

/**
 * Pulled from SO: https://stackoverflow.com/a/71059824
 *
 * This is meant to be used when a DTO property can be null or a value,
 * but not undefined.
 */
export function IsNullable(validationOptions?: ValidationOptions) {
  return ValidateIf((_object, value) => value !== null, validationOptions);
}
