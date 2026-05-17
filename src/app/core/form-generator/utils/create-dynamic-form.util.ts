import { WritableSignal } from '@angular/core';
import { FieldTree, form } from '@angular/forms/signals';
import { DynamicFormModelFromRecord } from '@/core/form-generator/types/dynamic-form-model.type';
import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import { setUpFormSchema } from './generate-custom-validation.util';

export function createDynamicForm<TRecord extends Record<string, FormFieldMetadata>>(
  modelSignal: WritableSignal<DynamicFormModelFromRecord<TRecord>>,
  metadataRecord: TRecord,
): FieldTree<DynamicFormModelFromRecord<TRecord>> {
  return form(modelSignal, (schemaPath) => setUpFormSchema(schemaPath, metadataRecord));
}
