import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import { createDynamicForm } from '@/core/form-generator/utils/create-dynamic-form.util';
import { ImageFacadeService } from '@/features/ai-generation/services/image-facade.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import DynamicFormComponent from '@/shared/ui/form/dynamic-form/dynamic-form.component';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-country-form',
  imports: [ImageDisplayComponent, DynamicFormComponent],
  template: ` <div class="image-card">
    <h2 class="image-title">{{ pageTitle() }}</h2>
    <app-dynamic-form
      [formFieldMetadata]="metadata"
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

  currentRoute = inject(ActivatedRoute);

  metadata = this.currentRoute.snapshot.data['metadata'] as Record<string, FormFieldMetadata>;
  dynamicFormContext = createDynamicForm(this.metadata);
  countryModel = this.dynamicFormContext.modelSignal;
  countryForm = this.dynamicFormContext.dynamicForm;

  pageTitle = computed(() => this.pageTitleTemplateKeyId().pageTitle);
  hasRequiredData = computed(
    () => !!this.pageTitleTemplateKeyId().templateKeyId && this.countryForm().valid(),
  );

  #imageFacade = inject(ImageFacadeService);

  isDisabled = computed(() => this.#imageFacade.uiState().isLoading || !this.hasRequiredData());
  uiState = this.#imageFacade.uiState;

  async generateImage(event$: Event) {
    event$.preventDefault();
    if (!this.hasRequiredData()) {
      return;
    }

    await this.#imageFacade.generateImage(
      this.pageTitleTemplateKeyId().templateKeyId as TemplateKey,
      this.hasRequiredData(),
      this.countryModel(),
    );
  }
}
