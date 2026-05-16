import { TemplateKey } from '@/features/ai/types/template-key.type';
import { GlobalStateService } from '@/shared/services/global-state.service';
import { ImageGenerationService } from '@/shared/services/image.service';
import { FileUpload } from '@/shared/types/file-upload.type';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import { FileUploaderComponent } from '@/shared/ui/file-uploader/file-uploader.component';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

@Component({
  selector: 'app-edit-image',
  imports: [FileUploaderComponent, ImageDisplayComponent],
  templateUrl: './edit-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EditImageComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();

  inlineData = signal('');
  mimeType = signal('');
  newImage = signal('');

  pageTitle = computed(() => this.pageTitleTemplateKeyId().pageTitle);
  hasRequiredData = computed(
    () => !!this.pageTitleTemplateKeyId().templateKeyId && !!this.mimeType() && !!this.inlineData(),
  );

  #globalStateService = inject(GlobalStateService);
  #imageGenerationService = inject(ImageGenerationService);

  isLoading = this.#globalStateService.isLoading;
  isError = this.#globalStateService.isError;
  errorMsg = computed(() => this.#globalStateService.errorMsg() || 'Unknown Error');

  onFileChanged(file: FileUpload | undefined) {
    this.inlineData.set(file?.inlineData || '');
    this.mimeType.set(file?.mimeType || '');
  }

  async generateImage(event$: Event) {
    event$.preventDefault();
    if (this.hasRequiredData()) {
      try {
        this.newImage.set('');
        const templateKey = this.pageTitleTemplateKeyId().templateKeyId as TemplateKey;

        const inlineImages = [
          {
            data: this.inlineData(),
            mimeType: this.mimeType(),
          },
        ];
        const result = await this.#imageGenerationService.generateImage(
          this.hasRequiredData(),
          templateKey,
          {
            inlineImages,
          },
        );
        this.newImage.set(result);
      } catch (e) {
        console.error(e);
        this.#globalStateService.setError('An error occurred while generating the image.');
      } finally {
        this.#globalStateService.stopLoading();
      }
    }
  }
}
