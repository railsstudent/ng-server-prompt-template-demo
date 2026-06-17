import { MetadataRecordSchema } from '@/core/form-generator/schemas/form-field-metadata.schema';
import { PathFormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import cityFormMetadata from '@/public/metadata/city-form-metadata.json';
import countryFormMetadata from '@/public/metadata/country-form-metadata.json';
import historicEventFormMetadata from '@/public/metadata/historic-event-form-metadata.json';

export const METADATA_MAPPING: PathFormFieldMetadata[] = [
  {
    path: '/country-form',
    metadata: MetadataRecordSchema.parse(countryFormMetadata),
  },
  {
    path: '/historic-event-form',
    metadata: MetadataRecordSchema.parse(historicEventFormMetadata),
  },
  {
    path: '/city-form',
    metadata: MetadataRecordSchema.parse(cityFormMetadata),
  },
];
