import { ImageFacadeService } from '@/features/ai-generation/services/image-facade.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { debounce, form, FormField, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-historic-event-form',
  imports: [FormField, ImageDisplayComponent],
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
        event: this.historicEventModel().event,
        description: this.historicEventModel().description,
      },
    );
    this.newImage.set(result);
  }
}
