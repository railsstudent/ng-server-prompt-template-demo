import { COUNTRY_FORM_METADATA } from '@/features/country-form/constants/metadata-list.const';
import { HISTORIC_EVENT_FORM_METADATA } from '@/features/historic-event-form/constants/metadata-list.const';
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
