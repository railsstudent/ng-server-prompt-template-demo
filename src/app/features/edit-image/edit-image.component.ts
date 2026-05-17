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
  templateUrl: './edit-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EditImageComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();

  newImage = signal('');
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

  isDisabled = computed(() => this.#imageFacade.isLoading() || !this.hasRequiredData());
  uiState = computed(() => {
    return {
      image: this.newImage(),
      isLoading: this.#imageFacade.isLoading(),
      isError: this.#imageFacade.isError(),
      errMsg: this.#imageFacade.errorMsg(),
    };
  });

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

    this.newImage.set('');
    const inlineImagesParams = toAiImageParams(this.inlineData());

    const result = await this.#imageFacade.generateImage(
      this.pageTitleTemplateKeyId().templateKeyId as TemplateKey,
      this.hasRequiredData(),
      inlineImagesParams,
    );
    this.newImage.set(result);
  }
}
