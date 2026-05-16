import { InlineData } from './inline-data.type';

export interface ImageParams extends Record<string, unknown> {
  inlineImages: InlineData[];
}
