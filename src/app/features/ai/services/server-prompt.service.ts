import { ContentMode } from '@/features/ai/types/data-mode.type';
import { inject, Injectable } from '@angular/core';
import { FinishReason } from 'firebase/ai';
import { SERVER_TEMPLATE_MODEL } from '../constants/server-template-model.token';

@Injectable({
  providedIn: 'root',
})
export class ServerPromptService {
  #model = inject(SERVER_TEMPLATE_MODEL);

  async generateContent(
    templateId: string,
    params: Record<string, unknown>,
  ): Promise<ContentMode[]> {
    const result = await this.#model.generateContent(templateId, params);
    const contents: ContentMode[] = [];

    const candidates = result.response.candidates || [];
    if (candidates.length === 0) {
      throw new Error('No image generated');
    }

    for (const candidate of candidates) {
      const parts = candidate.content.parts || [];
      for (const part of parts) {
        const { text: content, inlineData } = part;
        const { data, mimeType } = inlineData || {};
        if (content) {
          contents.push({ mode: 'text', content });
        } else if (data && mimeType) {
          contents.push({ mode: 'image', content: `data:${mimeType};base64,${data}` });
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
