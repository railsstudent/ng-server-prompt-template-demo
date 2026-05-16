import { ImageParams } from '../types/image-params.type';

export function toAiImageParams(inlineData: { data: string; mimeType: string }): ImageParams {
  return {
    inlineImages: [inlineData],
  };
}
