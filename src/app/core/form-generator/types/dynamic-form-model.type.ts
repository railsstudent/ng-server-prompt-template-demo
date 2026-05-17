import { FormFieldMetadata } from './form-field-metadata.type';

interface FieldTypeMap {
  string: string;
  number: number;
  'string[]': string[];
  'number[]': number[];
}

export type DynamicFormModelFromRecord<T extends Record<string, FormFieldMetadata>> = {
  [Key in keyof T as T[Key]['fieldName']]: FieldTypeMap[T[Key]['fieldType']];
};
