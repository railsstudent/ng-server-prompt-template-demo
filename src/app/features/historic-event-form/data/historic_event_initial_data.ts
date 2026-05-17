import { generateFormModelData } from '@/core/form-generator/utils/generate-form-model.util';
import { HISTORIC_EVENT_FORM_METADATA } from '../constants/metadata-list.const';

export const HISTORIC_EVENT_INITIAL_DATA = generateFormModelData(HISTORIC_EVENT_FORM_METADATA);
