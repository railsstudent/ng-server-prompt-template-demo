import { setUpSchemaForPath } from '@/core/form-generator/utils/generate-custom-validation.util';
import { generateFormModelData } from '@/core/form-generator/utils/generate-form-model.util';
import { ImageFacadeService } from '@/features/ai-generation/services/image-facade.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import countryList from '@/public/countries.json';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import FormFieldErrorComponent from '@/shared/ui/form/form-field-error/form-field-error.component';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { COUNTRY_FORM_METADATA } from './constants/metadata-list.const';
import { CountryFormModel } from './types/country-form-model.type';

@Component({
  selector: 'app-country-form',
  imports: [FormField, ImageDisplayComponent, FormFieldErrorComponent],
  templateUrl: './country-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CountryFormComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();
  countryModel = signal<CountryFormModel>(generateFormModelData(COUNTRY_FORM_METADATA));
  countryForm = form(this.countryModel, (schemaPath) => {
    const countryFieldConfig = COUNTRY_FORM_METADATA['country']?.fieldValidatorConfig;
    setUpSchemaForPath(schemaPath.country, countryFieldConfig);
  });

  newImage = signal('');
  pageTitle = computed(() => this.pageTitleTemplateKeyId().pageTitle);
  hasRequiredData = computed(
    () => !!this.pageTitleTemplateKeyId().templateKeyId && !!this.countryModel().country,
  );
  countries = countryList.countries;

  #imageFacade = inject(ImageFacadeService);

  isLoading = this.#imageFacade.isLoading;
  isError = this.#imageFacade.isError;
  errorMsg = this.#imageFacade.errorMsg;

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
