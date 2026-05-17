import { setUpSchemaForPath } from '@/core/form-generator/utils/generate-custom-validation.util';
import { generateFormModelData } from '@/core/form-generator/utils/generate-form-model.util';
import { ImageFacadeService } from '@/features/ai-generation/services/image-facade.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import FormFieldErrorComponent from '@/shared/ui/form/form-field-error/form-field-error.component';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { HISTORIC_EVENT_FORM_METADATA } from './constants/metadata-list.const';
import { HistoricEventFormModel } from './types/historic-event-form-model.type';

@Component({
  selector: 'app-historic-event-form',
  imports: [FormField, ImageDisplayComponent, FormFieldErrorComponent],
  templateUrl: './historic-event-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HistoricFormComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();

  historicEventModel = signal<HistoricEventFormModel>(
    generateFormModelData(HISTORIC_EVENT_FORM_METADATA),
  );

  historicEventForm = form(this.historicEventModel, (schemaPath) => {
    const eventFieldConfig = HISTORIC_EVENT_FORM_METADATA['event']?.fieldValidatorConfig;
    setUpSchemaForPath(schemaPath.event, eventFieldConfig);
    const descriptionFieldConfig =
      HISTORIC_EVENT_FORM_METADATA['description']?.fieldValidatorConfig;
    setUpSchemaForPath(schemaPath.description, descriptionFieldConfig);
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
