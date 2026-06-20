import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { CountryCityPair } from './types/country-city-pair.type';

@Component({
  selector: 'app-city-select',
  imports: [],
  template: ` <label [for]="fieldName()" class="dynamic-form-label">
    <span>{{ label() }}</span>
    <select [id]="fieldName()" class="dynamic-form-text">
      @for (c of cities(); track c.id) {
        @let displayValue = c.country + ' - ' + c.city;
        <option [value]="c.city">{{ displayValue }}</option>
      }
    </select>
  </label>`,
  styleUrl: '../dynamic-form/dynamic-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitySelectComponent implements FormValueControl<string> {
  value = model('');

  label = input.required<string>();
  fieldName = input.required<string>();
  cities = input.required<CountryCityPair[]>();
}
