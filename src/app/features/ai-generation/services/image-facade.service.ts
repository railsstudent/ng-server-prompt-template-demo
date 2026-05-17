import { TemplateConfigService } from '@/features/ai/services/template-config.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { GlobalStateService } from '@/shared/services/global-state.service';
import { ImageGenerationService } from '@/shared/services/image.service';
import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageFacadeService {
  #globalStateService = inject(GlobalStateService);
  #imageGenerationService = inject(ImageGenerationService);
  #templateConfigService = inject(TemplateConfigService);

  #newImage = signal('');

  uiState = computed(() => {
    return {
      image: this.#newImage(),
      isLoading: this.#globalStateService.isLoading(),
      isError: this.#globalStateService.isError(),
      errMsg: this.#globalStateService.errorMsg() || 'Unknown Error',
    };
  });

  updateImage(image: string) {
    this.#newImage.set(image);
  }

  async generateImage(
    templateKey: TemplateKey,
    hasRequiredData: boolean,
    params: Record<string, unknown>,
  ) {
    try {
      if (hasRequiredData) {
        const templateId = this.#templateConfigService.getTemplateValue(templateKey);
        return await this.#imageGenerationService.generateImage(
          hasRequiredData,
          templateId,
          params,
        );
      }
    } catch (e) {
      console.error(e);
      this.#globalStateService.setError('An error occurred while generating the image.');
    } finally {
      this.#globalStateService.stopLoading();
    }

    return '';
  }
}
