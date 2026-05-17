import { generateFormModelData } from '@/core/form-generator/utils/generate-form-model.util';
import { COUNTRY_FORM_METADATA } from '@/features/country-form/constants/metadata-list.const';

export const COUNTRY_INITIAL_DATA = generateFormModelData(COUNTRY_FORM_METADATA);
