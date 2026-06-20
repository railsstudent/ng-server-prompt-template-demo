import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import { setUpFormSchema } from '@/core/form-generator/utils/generate-custom-validation.util';
import { generateFormModelData } from '@/core/form-generator/utils/generate-form-model.util';
import { ImageFacadeService } from '@/features/ai-generation/services/image-facade.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import cityList from '@/public/cities.json';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import DynamicFormComponent from '@/shared/ui/form/dynamic-form/dynamic-form.component';
import ImageDisplayComponent from '@/shared/ui/image-display/image-display.component';
import { getStringValue } from '@/shared/utils/value-transformer.util';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { form } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-generator',
  imports: [ImageDisplayComponent, DynamicFormComponent],
  template: ` <div class="image-card">
    <h2 class="image-title">{{ pageTitle() }}</h2>
    <app-dynamic-form
      [formFieldMetadata]="metadata"
      [signalForm]="genericForm"
      [isBtnDisabled]="isDisabled()"
      (btnClicked)="generateImage($event)"
    />
    <app-image-display [uiState]="uiState()" />
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormGeneratorComponent {
  pageTitleTemplateKeyId = input.required<PageTitleTemplateKeyId>();
  currentRoute = inject(ActivatedRoute);

  metadata = this.currentRoute.snapshot.data['metadata'] as Record<string, FormFieldMetadata>;
  modelSignal = signal(generateFormModelData(this.metadata));
  genericForm = form(this.modelSignal, (schemaPath) => setUpFormSchema(schemaPath, this.metadata));

  pageTitle = computed(() => this.pageTitleTemplateKeyId().pageTitle);
  hasRequiredData = computed(
    () => !!this.pageTitleTemplateKeyId().templateKeyId && this.genericForm().valid(),
  );

  transformedModel = linkedSignal({
    source: () => this.modelSignal(),
    computation: (data) => {
      if (data['city']) {
        const cityValue = getStringValue(data['city']);
        if (cityValue) {
          const cityRecord = cityList.results.find((item) => item.city === cityValue);
          if (cityRecord) {
            return {
              city: cityRecord.city,
              country: cityRecord.country,
            };
          }
        }
      }
      return data;
    },
  });

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
      this.transformedModel(),
    );
  }
}
