import countryList from '@/public/countries.json';
import { FormFieldMetadata } from '../types/form-field-metadata.type';
import { DynamicFormModelFromRecord } from '../types/dynamic-form-model.type';

export function generateFormModelData<T extends Record<string, FormFieldMetadata>>(
  metadataRecord: T,
): DynamicFormModelFromRecord<T> {
  const model = {} as DynamicFormModelFromRecord<T>;
  const metadataList = Object.values(metadataRecord);

  for (const metadata of metadataList) {
    let value = metadata.initialValue;

    if (metadata.listDataType === 'country') {
      const countryInfo = countryList.countries.find(
        (c: { code: string; name: string }) => c.name === value || c.code === value,
      );
      value = countryInfo ? value : '';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (model as any)[metadata.fieldName] = value;
  }

  return model;
}
