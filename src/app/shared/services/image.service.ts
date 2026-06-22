import { ServerPromptService } from '@/features/ai/services/server-prompt.service';
import { inject, Service } from '@angular/core';
import { GlobalStateService } from './global-state.service';

@Service()
export class ImageGenerationService {
  #globalStateService = inject(GlobalStateService);
  #serverPromptService = inject(ServerPromptService);

  async generateImage(
    hasRequiredData: boolean,
    templateId: string,
    params: Record<string, unknown>,
  ): Promise<string> {
    if (hasRequiredData) {
      try {
        this.#globalStateService.startLoading();
        const results = await this.#serverPromptService.generateContent(templateId, params);
        const images = results.filter((item) => item.mode === 'image');
        if (images.length > 0) {
          return images[0].content;
        } else {
          throw new Error('No image generated');
        }
      } catch (e) {
        console.error(e);
        this.#globalStateService.setError('An error occurred while generating the image.');
      } finally {
        this.#globalStateService.stopLoading();
      }
    }

    return '';
  }
}
