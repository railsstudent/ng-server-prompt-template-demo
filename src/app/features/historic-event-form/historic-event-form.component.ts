import { createDynamicForm } from '@/core/form-generator/utils/create-dynamic-form.util';
import { ImageFacadeService } from '@/features/ai-generation/services/image-facade.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import DynamicFormComponent from '@/shared/ui/form/dynamic-form/dynamic-form.component';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HISTORIC_EVENT_FORM_METADATA } from './constants/metadata-list.const';

@Component({
  selector: 'app-historic-event-form',
  imports: [ImageDisplayComponent, DynamicFormComponent],
  template: ` <div class="image-card">
    <h2 class="image-title">{{ pageTitle() }}</h2>
    <app-dynamic-form
      [formFieldMetadata]="historicEventMetadataList"
      [signalForm]="historicEventForm"
      [isBtnDisabled]="isDisabled()"
      (btnClicked)="generateImage($event)"
    />
    <app-image-display [uiState]="uiState()" />
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HistoricFormComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();

  dynamicFormContext = createDynamicForm(HISTORIC_EVENT_FORM_METADATA);
  historicEventModel = this.dynamicFormContext.modelSignal;
  historicEventForm = this.dynamicFormContext.dynamicForm;
  historicEventMetadataList = this.dynamicFormContext.metadataList;

  pageTitle = computed(() => this.pageTitleTemplateKeyId().pageTitle);
  hasRequiredData = computed(
    () => !!this.pageTitleTemplateKeyId().templateKeyId && this.historicEventForm().valid(),
  );

  #imageFacade = inject(ImageFacadeService);

  isDisabled = computed(() => this.#imageFacade.uiState().isLoading || !this.hasRequiredData());
  uiState = this.#imageFacade.uiState;

  async generateImage(event$: Event) {
    event$.preventDefault();
    if (!this.hasRequiredData()) {
      return;
    }

    this.#imageFacade.updateImage('');
    const result = await this.#imageFacade.generateImage(
      this.pageTitleTemplateKeyId().templateKeyId as TemplateKey,
      this.hasRequiredData(),
      {
        event: this.historicEventModel().event,
        description: this.historicEventModel().description,
      },
    );
    this.#imageFacade.updateImage(result);
  }
}
