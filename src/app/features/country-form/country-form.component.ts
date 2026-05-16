import { TemplateKey } from '@/features/ai/types/template-key.type';
import countryList from '@/public/countries.json';
import { GlobalStateService } from '@/shared/services/global-state.service';
import { ImageGenerationService } from '@/shared/services/image.service';
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
  hasFormData = computed(() => this.countryModel().country.trim().length > 0);
  hasRequiredData = computed(
    () => !!this.pageTitleTemplateKeyId().templateKeyId && this.hasFormData(),
  );
  countries = countryList.countries;

  #globalStateService = inject(GlobalStateService);
  #imageGenerationService = inject(ImageGenerationService);

  isLoading = this.#globalStateService.isLoading;
  isError = this.#globalStateService.isError;
  errorMsg = computed(() => this.#globalStateService.errorMsg() || 'Unknown Error');

  async generateImage(event$: Event) {
    event$.preventDefault();
    if (this.hasRequiredData()) {
      try {
        this.newImage.set('');
        const templateKey = this.pageTitleTemplateKeyId().templateKeyId as TemplateKey;
        const result = await this.#imageGenerationService.generateImage(
          this.hasRequiredData(),
          templateKey,
          {
            country: this.countryModel().country,
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
