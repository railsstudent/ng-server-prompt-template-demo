import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import countryFormMetadata from '@/public/metadata/country-form-metadata.json';
import historicEventFormMetadata from '@/public/metadata/historic-event-form-metadata.json';
import cityFormMetadata from '@/public/metadata/city-form-metadata.json';

export const METADATA_MAPPING: {
  path: string;
  metadata: Record<string, FormFieldMetadata>;
}[] = [
  {
    path: '/country-form',
    metadata: countryFormMetadata as unknown as Record<string, FormFieldMetadata>,
  },
  {
    path: '/historic-event-form',
    metadata: historicEventFormMetadata as unknown as Record<string, FormFieldMetadata>,
  },
  {
    path: '/city-form',
    metadata: cityFormMetadata as unknown as Record<string, FormFieldMetadata>,
  },
];
