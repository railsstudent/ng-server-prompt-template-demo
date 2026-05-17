import { DynamicFormModelFromRecord } from '@/core/form-generator/types/dynamic-form-model.type';
import { HISTORIC_EVENT_FORM_METADATA } from '../constants/metadata-list.const';

export type HistoricEventFormModel = DynamicFormModelFromRecord<
  typeof HISTORIC_EVENT_FORM_METADATA
>;
