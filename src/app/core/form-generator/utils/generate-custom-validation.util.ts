import {
  debounce,
  max,
  maxLength,
  min,
  minLength,
  PathKind,
  required,
  SchemaPath,
} from '@angular/forms/signals';
import { ValidationConfig as FormFieldValidationConfig } from '../types/form-field-validation.type';
import { FormFieldMetadata } from '../types/form-field-metadata.type';

type ValidatorApplier = (path: unknown, config: FormFieldValidationConfig) => void;

const VALIDATOR_REGISTRY: Partial<Record<keyof FormFieldValidationConfig, ValidatorApplier>> = {
  isRequired: (path, config) => {
    if (config.isRequired) {
      required(path as SchemaPath<unknown>, {
        message: config.requiredErrorMsg ?? 'This field is required',
      });
    }
  },
  maxLength: (path, config) => {
    if (config.maxLength !== undefined && config.maxLength > 0) {
      maxLength(path as SchemaPath<string | unknown[]>, config.maxLength, {
        message: config.maxLengthErrorMsg ?? 'Maximum length exceeded',
      });
    }
  },
  minLength: (path, config) => {
    if (config.minLength !== undefined && config.minLength > 0) {
      minLength(path as SchemaPath<string | unknown[]>, config.minLength, {
        message: config.minLengthErrorMsg ?? 'Minimum length not met',
      });
    }
  },
  min: (path, config) => {
    if (config.min !== undefined && config.min > 0) {
      min(path as SchemaPath<number | null, 1, PathKind.Root>, config.min, {
        message: config.minErrorMsg ?? 'Minimum value not met',
      });
    }
  },
  max: (path, config) => {
    if (config.max !== undefined && config.max > 0) {
      max(path as SchemaPath<number | null, 1, PathKind.Root>, config.max, {
        message: config.maxErrorMsg ?? 'Maximum value exceeded',
      });
    }
  },
  debounce: (path, config) => {
    if (config.debounce !== undefined && config.debounce > 0) {
      debounce(path as SchemaPath<unknown>, config.debounce);
    }
  },
};

export function setUpSchemaForPath(path: unknown, config?: FormFieldValidationConfig): void {
  if (!config) {
    return;
  }

  (Object.keys(config) as (keyof FormFieldValidationConfig)[]).forEach((key) => {
    const applyValidator = VALIDATOR_REGISTRY[key];
    if (applyValidator) {
      applyValidator(path, config);
    }
  });
}

export function setUpFormSchema(
  schemaPath: unknown,
  metadataRecord: Record<string, FormFieldMetadata>,
): void {
  Object.keys(metadataRecord).forEach((key) => {
    setUpSchemaForPath(
      (schemaPath as Record<string, unknown>)[key],
      metadataRecord[key].fieldValidatorConfig,
    );
  });
}
