import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import countryList from '@/public/countries.json';
import cityList from '@/public/cities.json';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import FormFieldErrorComponent from '../form-field-error/form-field-error.component';

@Component({
  selector: 'app-dynamic-form',
  imports: [FormField, FormFieldErrorComponent],
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

  countries = countryList.countries;
  cities = cityList.results;
  formFieldMetadataList = computed(() => Object.values(this.formFieldMetadata()));
}
