import { COUNTRY_FORM_METADATA } from '@/core/constants/country-form-metadata.const';
import { HISTORIC_EVENT_FORM_METADATA } from '@/core/constants/historic-event-form-metadata.const';
import { FormFieldMetadata } from '../form-generator/types/form-field-metadata.type';

export const METADATA_MAPPING: {
  path: string;
  metadata: Record<string, FormFieldMetadata>;
}[] = [
  {
    path: '/country-form',
    metadata: COUNTRY_FORM_METADATA,
  },
  {
    path: '/historic-event-form',
    metadata: HISTORIC_EVENT_FORM_METADATA,
  },
];
