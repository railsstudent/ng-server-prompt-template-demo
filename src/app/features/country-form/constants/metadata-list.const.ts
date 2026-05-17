import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';

export const COUNTRY_FORM_METADATA = {
  country: {
    fieldName: 'country',
    fieldType: 'string',
    initialValue: '',
    inputControl: 'input',
    inputType: 'text',
    isMultiSelect: false,
    listDataType: 'country',
    fieldValidatorConfig: {
      isRequired: true,
      requiredErrorMsg: 'Country is required',
      debounce: 300,
    },
  },
} as const satisfies Record<string, FormFieldMetadata>;

export const COUNTRY_FORM_METADATA_LIST: FormFieldMetadata[] = Object.values(COUNTRY_FORM_METADATA);
