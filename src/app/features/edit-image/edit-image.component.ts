import { ServerPromptService } from '@/features/ai/services/server-prompt.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { GlobalStateService } from '@/shared/services/global-state.service';
import { FileUpload } from '@/shared/types/file-upload.type';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import { FileUploaderComponent } from '@/shared/ui/file-uploader/file-uploader.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

@Component({
  selector: 'app-edit-image',
  imports: [FileUploaderComponent],
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

  #serverPromptService = inject(ServerPromptService);
  #globalStateService = inject(GlobalStateService);

  isLoading = this.#globalStateService.isLoading.asReadonly();
  isError = this.#globalStateService.isError.asReadonly();
  errorMsg = computed(() => this.#globalStateService.errorMsg() || 'Unknown Error');

  onFileChanged(file: FileUpload | undefined) {
    this.inlineData.set(file?.inlineData || '');
    this.mimeType.set(file?.mimeType || '');
  }

  async generateImage(event$: Event) {
    event$.preventDefault();
    if (this.hasRequiredData()) {
      try {
        this.#globalStateService.startLoading();
        this.newImage.set('');

        const inlineImages = [
          {
            data: this.inlineData(),
            mimeType: this.mimeType(),
          },
        ];
        const result = await await this.#serverPromptService.generateContent(
          this.pageTitleTemplateKeyId().templateKeyId as TemplateKey,
          {
            inlineImages,
          },
        );
        this.newImage.set(result);
      } catch (e) {
        console.error(e);
        this.#globalStateService.isError.set(true);
        this.#globalStateService.errorMsg.set('An error occurred while generating the image.');
      } finally {
        this.#globalStateService.isLoading.set(false);
      }
    }
  }
}
