import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import { signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { DynamicFormContext } from '../types/dynamic-form-context.type';
import { setUpFormSchema } from './generate-custom-validation.util';
import { generateFormModelData } from './generate-form-model.util';

export function createDynamicForm<TRecord extends Record<string, FormFieldMetadata>>(
  metadataRecord: TRecord,
): DynamicFormContext<TRecord> {
  const initialData = generateFormModelData(metadataRecord);
  const modelSignal = signal(initialData);
  const dynamicForm = form(modelSignal, (schemaPath) =>
    setUpFormSchema(schemaPath, metadataRecord),
  );
  const metadataList = Object.values(metadataRecord);

  return {
    // initialData,
    modelSignal,
    dynamicForm,
    metadataList,
  };
}
