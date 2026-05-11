import { ServerPromptService } from '@/ai/services/server-prompt.service';
import { TemplateKey } from '@/ai/types/template-key.type';
import { PageTitleTemplateKeyId } from '@/types/page-title-template-keyid.type';
import { GlobalStateService } from '@/ui/services/global-state.service';
import { FileUpload } from '@/ui/types/file-upload.type';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FileUploaderComponent } from '../ui/file-uploader/file-uploader.component';

@Component({
  selector: 'app-edit-image',
  imports: [FileUploaderComponent],
  templateUrl: './edit-image.component.html',
  styleUrl: './edit-image.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EditImageComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();

  inlineData = signal('');
  mimeType = signal('');
  newImage = signal('');

  templateKeyId = computed(() => this.pageTitleTemplateKeyId().templateKeyId);
  pageTitle = computed(() => this.pageTitleTemplateKeyId().pageTitle);
  hasUrl = computed(() => this.inlineData().length > 0);

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
    if (this.templateKeyId() && this.mimeType() && this.inlineData()) {
      try {
        this.#globalStateService.isError.set(false);
        this.#globalStateService.errorMsg.set('');
        this.#globalStateService.isLoading.set(true);
        this.newImage.set('');

        const inlineImages = [
          {
            data: this.inlineData(),
            mimeType: this.mimeType(),
          },
        ];
        const result = await await this.#serverPromptService.generateContent(
          this.templateKeyId() as TemplateKey,
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
