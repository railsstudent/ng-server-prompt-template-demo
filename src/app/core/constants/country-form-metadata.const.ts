import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';

export const COUNTRY_FORM_METADATA = {
  country: {
    fieldName: 'country',
    fieldType: 'string',
    initialValue: '',
    inputControl: 'select',
    isMultiSelect: false,
    listDataType: 'country',
    label: 'Country:',
    fieldValidatorConfig: {
      isRequired: true,
      requiredErrorMsg: 'Country is required',
      debounce: 300,
    },
  },
} as const satisfies Record<string, FormFieldMetadata>;
