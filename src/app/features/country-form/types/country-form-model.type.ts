import { DynamicFormModelFromRecord } from '@/core/form-generator/types/dynamic-form-model.type';
import { COUNTRY_FORM_METADATA } from '../constants/metadata-list.const';

export type CountryFormModel = DynamicFormModelFromRecord<typeof COUNTRY_FORM_METADATA>;
