import { ServerPromptService } from '@/features/ai/services/server-prompt.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { GlobalStateService } from '@/shared/services/global-state.service';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { debounce, form, FormField, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-country-form',
  imports: [FormField],
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

  #serverPromptService = inject(ServerPromptService);
  #globalStateService = inject(GlobalStateService);

  isLoading = this.#globalStateService.isLoading.asReadonly();
  isError = this.#globalStateService.isError.asReadonly();
  errorMsg = computed(() => this.#globalStateService.errorMsg() || 'Unknown Error');

  async generateImage(event$: Event) {
    event$.preventDefault();
    if (this.hasRequiredData()) {
      try {
        this.#globalStateService.startLoading();
        this.newImage.set('');

        const result = await await this.#serverPromptService.generateContent(
          this.pageTitleTemplateKeyId().templateKeyId as TemplateKey,
          {
            country: this.countryModel().country,
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
