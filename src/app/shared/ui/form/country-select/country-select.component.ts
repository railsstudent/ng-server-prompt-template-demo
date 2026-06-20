import { Country } from '@/core/location/schemas/country.schema';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-country-select',
  imports: [],
  styleUrl: `../dynamic-form/dynamic-form.component.css`,
  template: `
    <label [for]="fieldName()" class="dynamic-form-label">
      <span>{{ label() }}</span>
      <select
        [id]="fieldName()"
        class="dynamic-form-text"
        [value]="value()"
        (change)="onSelectionChange($event)"
      >
        <option value="" disabled hidden>Please select an country</option>
        @for (c of countries(); track c.code) {
          <option [value]="c.name" [selected]="c.name === value()">{{ c.name }}</option>
        }
      </select>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountrySelectComponent implements FormValueControl<string> {
  value = model('');

  label = input.required<string>();
  fieldName = input.required<string>();
  countries = input.required<Country[]>();

  onSelectionChange(event: Event) {
    event.preventDefault();
    if (event.target) {
      const selectElement = event.target as HTMLSelectElement;
      this.value.set(selectElement.value || '');
    }
  }
}
