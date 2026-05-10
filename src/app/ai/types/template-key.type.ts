import { TEMPLATE_KEYS } from '../constants/template_keys.const';

export type TemplateKey = (typeof TEMPLATE_KEYS)[number];
export type TemplateMap = Record<TemplateKey, string>;
