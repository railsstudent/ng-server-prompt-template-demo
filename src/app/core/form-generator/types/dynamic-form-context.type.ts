import { WritableSignal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { DynamicFormModelFromRecord } from './dynamic-form-model.type';
import { FormFieldMetadata } from './form-field-metadata.type';

export interface DynamicFormContext<TRecord extends Record<string, FormFieldMetadata>> {
  modelSignal: WritableSignal<DynamicFormModelFromRecord<TRecord>>;
  dynamicForm: FieldTree<DynamicFormModelFromRecord<TRecord>>;
  metadataList: FormFieldMetadata[];
}
