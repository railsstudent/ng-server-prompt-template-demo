import { FormFieldMetadata } from '../form-generator/types/form-field-metadata.type';

export const EMPIRE_FORM_METADATA = {
  country: {
    fieldName: 'empire',
    fieldType: 'string',
    initialValue: 'Tang Dynasty',
    inputControl: 'input',
    isMultiSelect: false,
    label: 'Empire:',
    fieldValidatorConfig: {
      isRequired: true,
      requiredErrorMsg: 'Empire is required',
      debounce: 300,
    },
  },
} as const satisfies Record<string, FormFieldMetadata>;
