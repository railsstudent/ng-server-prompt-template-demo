import {
  debounce,
  max,
  maxLength,
  min,
  minLength,
  required,
  SchemaPath,
} from '@angular/forms/signals';
import { ValidationConfig } from '../types/form-field-validation.type';

export function setUpSchemaForPath<T>(path: SchemaPath<T>, config?: ValidationConfig): void {
  if (!config) {
    return;
  }

  if (config.isRequired) {
    required(path, { message: config.requiredErrorMsg ?? 'This field is required' });
  }

  if (config.debounce !== undefined && config.debounce > 0) {
    debounce(path, config.debounce);
  }

  if (typeof config.maxLength === 'number' && config.maxLength > 0) {
    maxLength(path as unknown as SchemaPath<string>, config.maxLength, {
      message: config.maxLengthErrorMsg ?? 'Maximum length exceeded',
    });
  }

  if (typeof config.minLength === 'number' && config.minLength > 0) {
    minLength(path as unknown as SchemaPath<string>, config.minLength, {
      message: config.minLengthErrorMsg ?? 'Minimum length not met',
    });
  }

  if (typeof config.max === 'number' && config.max > 0) {
    max(path as unknown as SchemaPath<number>, config.max, {
      message: config.maxErrorMsg ?? `Maxiumum value, ${config.max} not satisfied`,
    });
  }

  if (typeof config.min === 'number' && config.min > 0) {
    min(path as unknown as SchemaPath<number>, config.min, {
      message: config.minErrorMsg ?? `Minimum value, ${config.min} not satisfied`,
    });
  }
}
