import { ServerPromptService } from '@/features/ai/services/server-prompt.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { GlobalStateService } from '@/shared/services/global-state.service';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { debounce, form, FormField, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-historic-event-form',
  imports: [FormField],
  templateUrl: './historic-event-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HistoricFormComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();
  historicEventModel = signal<{ event: string; description: string }>({
    event: '',
    description: '',
  });
  historicEventForm = form(this.historicEventModel, (schemaPath) => {
    required(schemaPath.event, { message: 'Event is required' });
    minLength(schemaPath.event, 2, { message: 'Event must be at least 2 characters long' });
    debounce(schemaPath.event, 300);

    required(schemaPath.description, { message: 'Description is required' });
    minLength(schemaPath.description, 2, {
      message: 'Description must be at least 2 characters long',
    });
    debounce(schemaPath.description, 300);
  });

  newImage = signal('');
  pageTitle = computed(() => this.pageTitleTemplateKeyId().pageTitle);
  hasFormData = computed(() => this.historicEventModel().event.trim().length > 0);
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
            event: this.historicEventModel().event,
            description: this.historicEventModel().description,
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
