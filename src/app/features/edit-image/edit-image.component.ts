import { ImageFacadeService } from '@/features/ai-generation/services/image-facade.service';
import { toAiImageParams } from '@/features/ai-generation/utils/image-param-transformer.util';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { FileUpload } from '@/shared/types/file-upload.type';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import { FileUploaderComponent } from '@/shared/ui/file-uploader/file-uploader.component';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

@Component({
  selector: 'app-edit-image',
  imports: [FileUploaderComponent, ImageDisplayComponent],
  styleUrl: './edit-image.component.css',
  template: ` <div class="image-card">
    <h2 class="image-title">{{ pageTitle() }}</h2>
    <div class="edit-image">
      <app-file-uploader (fileChanged)="onFileChanged($event)" />
      <form novalidate class="edit-image-form">
        <button [disabled]="isDisabled()" (click)="generateImage($event)" class="btn-generate">
          Generate
        </button>
      </form>
    </div>
    <app-image-display [uiState]="uiState()" />
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EditImageComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();

  inlineData = signal({
    data: '',
    mimeType: '',
  });

  pageTitle = computed(() => this.pageTitleTemplateKeyId().pageTitle);
  hasRequiredData = computed(() => {
    const hasImage = !!this.inlineData().data && !!this.inlineData().mimeType;
    return !!this.pageTitleTemplateKeyId().templateKeyId && hasImage;
  });

  #imageFacade = inject(ImageFacadeService);

  isDisabled = computed(() => this.#imageFacade.uiState().isLoading || !this.hasRequiredData());
  uiState = this.#imageFacade.uiState;

  onFileChanged(file: FileUpload | undefined) {
    this.inlineData.set({
      data: file?.inlineData || '',
      mimeType: file?.mimeType || '',
    });
  }

  async generateImage(event$: Event) {
    event$.preventDefault();

    if (!this.hasRequiredData()) {
      return;
    }

    this.#imageFacade.updateImage('');
    const inlineImagesParams = toAiImageParams(this.inlineData());

    const result = await this.#imageFacade.generateImage(
      this.pageTitleTemplateKeyId().templateKeyId as TemplateKey,
      this.hasRequiredData(),
      inlineImagesParams,
    );
    this.#imageFacade.updateImage(result);
  }
}
