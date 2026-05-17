import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';

export const HISTORIC_EVENT_FORM_METADATA = {
  event: {
    fieldName: 'event',
    fieldType: 'string',
    initialValue: 'Oasis Reunion Tour',
    inputControl: 'input',
    inputType: 'text',
    isMultiSelect: false,
    label: 'Event:',
    fieldValidatorConfig: {
      isRequired: true,
      requiredErrorMsg: 'Event is required',
      minLength: 3,
      minLengthErrorMsg: 'Event must be at least 3 characters long',
      debounce: 300,
    },
  },
  description: {
    fieldName: 'description',
    fieldType: 'string',
    initialValue: 'Oasis Live 25 Tour in Australia',
    inputControl: 'textarea',
    inputType: 'text',
    isMultiSelect: false,
    label: 'Description:',
    fieldValidatorConfig: {
      isRequired: true,
      requiredErrorMsg: 'Description is required',
      minLength: 5,
      minLengthErrorMsg: 'Description must be at least 5 characters long',
      debounce: 300,
    },
  },
} as const satisfies Record<string, FormFieldMetadata>;

export const HISTORIC_EVENT_FORM_METADATA_LIST: FormFieldMetadata[] = Object.values(
  HISTORIC_EVENT_FORM_METADATA,
);
