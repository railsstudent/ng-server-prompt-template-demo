import { createDynamicForm } from '@/core/form-generator/utils/create-dynamic-form.util';
import { ImageFacadeService } from '@/features/ai-generation/services/image-facade.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import DynamicFormComponent from '@/shared/ui/form/dynamic-form/dynamic-form.component';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import {
  HISTORIC_EVENT_FORM_METADATA,
  HISTORIC_EVENT_FORM_METADATA_LIST,
} from './constants/metadata-list.const';
import { HISTORIC_EVENT_INITIAL_DATA } from './data/historic_event_initial_data';
import { HistoricEventFormModel } from './types/historic-event-form-model.type';

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

  historicEventModel = signal<HistoricEventFormModel>(HISTORIC_EVENT_INITIAL_DATA);
  historicEventForm = createDynamicForm(this.historicEventModel, HISTORIC_EVENT_FORM_METADATA);
  historicEventMetadataList = HISTORIC_EVENT_FORM_METADATA_LIST;

  newImage = signal('');
  pageTitle = computed(() => this.pageTitleTemplateKeyId().pageTitle);
  hasRequiredData = computed(
    () =>
      !!this.pageTitleTemplateKeyId().templateKeyId &&
      this.historicEventModel().event.trim().length > 0 &&
      this.historicEventModel().description.trim().length > 0,
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
        event: this.historicEventModel().event,
        description: this.historicEventModel().description,
      },
    );
    this.newImage.set(result);
  }
}
