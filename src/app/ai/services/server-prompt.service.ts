import { inject, Injectable } from '@angular/core';
import { FinishReason } from 'firebase/ai';
import { SERVER_TEMPLATE_MODEL } from '../constants/server-template-model.token';
import { TemplateKey } from '../types/template-key.type';
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
  ): Promise<string> {
    const templateId = this.#templateConfigService.getTemplateValue(templateKey);
    const result = await this.#model.generateContent(templateId, params);

    const candidates = result.response.candidates || [];
    if (candidates.length === 0) {
      throw new Error('No image generated');
    }

    for (const candidate of candidates) {
      const parts = candidate.content.parts || [];
      for (const part of parts) {
        const data = part.inlineData?.data;
        const mimeType = part.inlineData?.mimeType;
        if (data && mimeType) {
          return `data:${mimeType};base64,${data}`;
        }
      }
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
