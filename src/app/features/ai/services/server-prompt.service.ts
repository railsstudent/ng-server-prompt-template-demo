import { ContentMode } from '@/features/ai/types/data-mode.type';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { inject, Injectable } from '@angular/core';
import { FinishReason } from 'firebase/ai';
import { SERVER_TEMPLATE_MODEL } from '../constants/server-template-model.token';
import { TemplateConfigService } from './template-config.service';

@Injectable({
  providedIn: 'root',
})
export class ServerPromptService {
  #model = inject(SERVER_TEMPLATE_MODEL);
  #templateConfigService = inject(TemplateConfigService);

  async generateContent(
    templateKey: TemplateKey,
    params: Record<string, unknown>,
  ): Promise<ContentMode[]> {
    const templateId = this.#templateConfigService.getTemplateValue(templateKey);
    const result = await this.#model.generateContent(templateId, params);
    const contents: ContentMode[] = [];

    const candidates = result.response.candidates || [];
    if (candidates.length === 0) {
      throw new Error('No image generated');
    }

    for (const candidate of candidates) {
      const parts = candidate.content.parts || [];
      for (const part of parts) {
        const text = part.text;
        const data = part.inlineData?.data;
        const mimeType = part.inlineData?.mimeType;
        if (text) {
          contents.push({ mode: 'text', content: text });
        } else if (data && mimeType) {
          const inlineData = `data:${mimeType};base64,${data}`;
          contents.push({ mode: 'image', content: inlineData });
        }
      }
    }

    if (contents.length > 0) {
      return contents;
    }

    const abnormalCandidates = candidates.filter(
      (candidate) => candidate.finishReason && candidate.finishReason != FinishReason.STOP,
    );
    if (abnormalCandidates.length > 0) {
      for (const candidate of abnormalCandidates) {
        console.error(
          'Finish reason:',
          candidate.finishReason,
          'Finish message',
          candidate.finishMessage,
        );
      }
    }

    throw new Error(`Unable to generate the image for template Id: ${templateId}`);
  }
}
