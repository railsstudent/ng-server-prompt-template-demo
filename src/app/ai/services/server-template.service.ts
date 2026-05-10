import { inject, Injectable, signal } from '@angular/core';
import { FinishReason } from 'firebase/ai';
import { SERVER_TEMPLATE_MODEL } from '../constants/server-template-model.token';

@Injectable({
  providedIn: 'root',
})
export class ServerTemplateService {
  countryTemplateId = signal('');
  diecastTemplateId = signal('');
  figurineTemplateId = signal('');
  glassBottleTemplateId = signal('');
  historicEventTemplateId = signal('');
  threeDimentionsMapTemplateId = signal('');

  #model = inject(SERVER_TEMPLATE_MODEL);

  async generateContent(templateId: string, params: Record<string, any>): Promise<string> {
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
          return `data:${mimeType};base64,${data}`
        }
      }
    }

    const abnormalCandidates = candidates.filter((candidate) => candidate.finishReason && candidate.finishReason != FinishReason.STOP);
    if (abnormalCandidates.length > 0) {
      for (const candidate of abnormalCandidates) {
        console.error('Finish reason:', candidate.finishReason, 'Finish message', candidate.finishMessage);
      }
    }

    throw new Error(`Unable to generate the image for template Id: ${templateId}`);
  }
}
