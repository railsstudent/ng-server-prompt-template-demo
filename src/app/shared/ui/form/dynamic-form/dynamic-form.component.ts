import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import cityList from '@/public/cities.json';
import countryList from '@/public/countries.json';
import { CitySelectComponent } from '@/shared/ui/form/city-select/city-select.component';
import { CountrySelectComponent } from '@/shared/ui/form/country-select/country-select.component';
import FormFieldErrorComponent from '@/shared/ui/form/form-field-error/form-field-error.component';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-dynamic-form',
  imports: [FormField, FormFieldErrorComponent, CountrySelectComponent, CitySelectComponent],
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
