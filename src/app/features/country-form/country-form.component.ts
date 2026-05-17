import { createDynamicForm } from '@/core/form-generator/utils/create-dynamic-form.util';
import { ImageFacadeService } from '@/features/ai-generation/services/image-facade.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import DynamicFormComponent from '@/shared/ui/form/dynamic-form/dynamic-form.component';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { COUNTRY_FORM_METADATA, COUNTRY_FORM_METADATA_LIST } from './constants/metadata-list.const';
import { COUNTRY_INITIAL_DATA } from './data/country_initial_data';
import { CountryFormModel } from './types/country-form-model.type';

@Component({
  selector: 'app-country-form',
  imports: [ImageDisplayComponent, DynamicFormComponent],
  template: ` <div class="image-card">
    <h2 class="image-title">{{ pageTitle() }}</h2>
    <app-dynamic-form
      [formFieldMetadata]="countryMetadataList"
      [signalForm]="countryForm"
      [isBtnDisabled]="isDisabled()"
      (btnClicked)="generateImage($event)"
    />
    <app-image-display [uiState]="uiState()" />
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CountryFormComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();
  countryModel = signal<CountryFormModel>(COUNTRY_INITIAL_DATA);
  countryForm = createDynamicForm(this.countryModel, COUNTRY_FORM_METADATA);

  countryMetadataList = COUNTRY_FORM_METADATA_LIST;

  newImage = signal('');
  pageTitle = computed(() => this.pageTitleTemplateKeyId().pageTitle);
  hasRequiredData = computed(
    () => !!this.pageTitleTemplateKeyId().templateKeyId && !!this.countryModel().country,
  );

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

  async generateImage(event$: Event) {
    event$.preventDefault();
    if (!this.hasRequiredData()) {
      return;
    }

    this.newImage.set('');
    const result = await this.#imageFacade.generateImage(
      this.pageTitleTemplateKeyId().templateKeyId as TemplateKey,
      this.hasRequiredData(),
      {
        country: this.countryModel().country,
      },
    );
    this.newImage.set(result);
  }
}
