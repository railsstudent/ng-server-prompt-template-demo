import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import { LOCATION_SELECT_CONFIG } from '@/core/location/location-select.config';
import { DataListSelectComponent } from '@/shared/ui/form/data-list-select/data-list-select.component';
import FormFieldErrorComponent from '@/shared/ui/form/form-field-error/form-field-error.component';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-dynamic-form',
  imports: [FormField, FormFieldErrorComponent, DataListSelectComponent],
  styleUrl: './dynamic-form.component.css',
  templateUrl: './dynamic-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DynamicFormComponent {
  formFieldMetadata = input.required<Record<string, FormFieldMetadata>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signalForm = input.required<any>();
  isBtnDisabled = input.required<boolean>();
  btnClicked = output<Event>();

  selectConfigs = LOCATION_SELECT_CONFIG;
  formFieldMetadataList = computed(() => Object.values(this.formFieldMetadata()));
}
