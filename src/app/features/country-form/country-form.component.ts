import { ImageFacadeService } from '@/features/ai-generation/services/image-facade.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import countryList from '@/public/countries.json';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { debounce, form, FormField, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-country-form',
  imports: [FormField, ImageDisplayComponent],
  templateUrl: './country-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CountryFormComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();
  countryModel = signal<{ country: string }>({
    country: '',
  });
  countryForm = form(this.countryModel, (schemaPath) => {
    required(schemaPath.country, { message: 'Country is required' });
    minLength(schemaPath.country, 2, { message: 'Country must be at least 2 characters long' });
    debounce(schemaPath.country, 300);
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
