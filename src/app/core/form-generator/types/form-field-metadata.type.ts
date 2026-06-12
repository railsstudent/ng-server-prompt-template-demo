import { ValidationConfig } from './form-field-validation.type';

export interface FormFieldMetadata {
  fieldName: string;
  fieldType: 'string' | 'number' | 'string[]' | 'number[]';
  initialValue: string | number | string[] | number[];
  inputControl: 'input' | 'textarea' | 'select';
  isMultiSelect?: boolean;
  inputType?: 'text' | 'number' | 'radio' | 'checkbox' | 'password';
  fieldValidatorConfig?: ValidationConfig;
  listDataType?: 'country' | 'city';
  label?: string;
}
