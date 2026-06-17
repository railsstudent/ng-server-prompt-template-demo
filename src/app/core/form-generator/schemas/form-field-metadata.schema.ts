import { z } from 'zod';
import { FormFieldMetadata } from '../types/form-field-metadata.type';
import { ValidationConfig } from '../types/form-field-validation.type';

export const validationConfigSchema: z.ZodType<ValidationConfig> = z.object({
  isRequired: z.boolean().optional(),
  requiredErrorMsg: z.string().optional(),
  debounce: z.number().optional(),
  maxLength: z.number().optional(),
  maxLengthErrorMsg: z.string().optional(),
  minLength: z.number().optional(),
  minLengthErrorMsg: z.string().optional(),
  min: z.number().optional(),
  minErrorMsg: z.string().optional(),
  max: z.number().optional(),
  maxErrorMsg: z.string().optional(),
});

export const formFieldMetadataSchema: z.ZodType<FormFieldMetadata> = z.object({
  fieldName: z.string(),
  fieldType: z.enum(['string', 'number', 'string[]', 'number[]']),
  initialValue: z.union([z.string(), z.number(), z.array(z.string()), z.array(z.number())]),
  inputControl: z.enum(['input', 'textarea', 'select']),
  isMultiSelect: z.boolean().optional(),
  inputType: z.enum(['text', 'number', 'radio', 'checkbox', 'password']).optional(),
  fieldValidatorConfig: validationConfigSchema.optional(),
  listDataType: z.enum(['country', 'city']).optional(),
  label: z.string().optional(),
});

export const MetadataRecordSchema = z.record(z.string(), formFieldMetadataSchema);
