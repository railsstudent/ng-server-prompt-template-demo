import { COUNTRY_FORM_METADATA } from '@/core/constants/country-form-metadata.const';
import { HISTORIC_EVENT_FORM_METADATA } from '@/core/constants/historic-event-form-metadata.const';
import { FormFieldMetadata } from '../form-generator/types/form-field-metadata.type';
import { EMPIRE_FORM_METADATA } from './empire-form-metadata.const';

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
    path: '/empire-form',
    metadata: EMPIRE_FORM_METADATA,
  },
];
