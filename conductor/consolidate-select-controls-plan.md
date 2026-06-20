# Consolidate Select Controls Plan

## Objective

Consolidate `CitySelectComponent` and `CountrySelectComponent` into a single, generic `DataListSelectComponent` and introduce a centralized configuration map (`LOCATION_SELECT_CONFIG`) to eliminate code duplication and simplify template branching logic.

## Key Files & Context

- **New Configuration**: `src/app/core/location/location-select.config.ts`
- **New Generic Component**: `src/app/shared/ui/form/data-list-select/data-list-select.component.ts`
- **Updated Form Component**:
  - `src/app/shared/ui/form/dynamic-form/dynamic-form.component.ts`
  - `src/app/shared/ui/form/dynamic-form/dynamic-form.component.html`
- **Obsolete Folders to Delete**:
  - `src/app/shared/ui/form/city-select/`
  - `src/app/shared/ui/form/country-select/`

## Implementation Steps

### 1. Create Location Select Config

Create `src/app/core/location/location-select.config.ts` to map `listDataType` values (`'city'`, `'country'`) to their corresponding data and extractor functions:

```typescript
import { getCities, getCountries } from './utils/location.util';
import { City } from './types/city.type';
import { Country } from './types/country.type';

export interface DataListConfig<T = any> {
  items: T[];
  placeholder: string;
  trackBy: (item: T) => string | number;
  value: (item: T) => string;
  label: (item: T) => string;
}

export const LOCATION_SELECT_CONFIG: Record<'city' | 'country', DataListConfig> = {
  city: {
    items: getCities(),
    placeholder: 'Please select a city',
    trackBy: (c: City) => c.id,
    value: (c: City) => c.city,
    label: (c: City) => `${c.country} - ${c.city}`,
  },
  country: {
    items: getCountries(),
    placeholder: 'Please select a country',
    trackBy: (c: Country) => c.code,
    value: (c: Country) => c.name,
    label: (c: Country) => c.name,
  },
};
```

### 2. Create Generic Select Control

Create `src/app/shared/ui/form/data-list-select/data-list-select.component.ts` implementing `FormValueControl<string>`:

```typescript
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-data-list-select',
  template: `
    <label [for]="fieldName()" class="dynamic-form-label">
      <span>{{ label() }}</span>
      <select
        [id]="fieldName()"
        class="dynamic-form-text"
        [value]="value()"
        (change)="onSelectionChange($event)"
      >
        <option value="" disabled hidden>{{ placeholder() }}</option>
        @for (item of items(); track trackByFn()(item)) {
          <option
            [value]="valueFn()(item)"
            [selected]="valueFn()(item) === value()"
          >
            {{ labelFn()(item) }}
          </option>
        }
      </select>
    </label>
  `,
  styleUrl: '../dynamic-form/dynamic-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataListSelectComponent<T> implements FormValueControl<string> {
  value = model('');

  label = input.required<string>();
  fieldName = input.required<string>();
  placeholder = input<string>('Please make a selection');

  items = input.required<T[]>();
  trackByFn = input.required<(item: T) => string | number>();
  valueFn = input.required<(item: T) => string>();
  labelFn = input.required<(item: T) => string>();

  onSelectionChange(event: Event) {
    event.preventDefault();
    if (event.target) {
      const element = event.target as HTMLSelectElement;
      this.value.set(element.value || '');
    }
  }
}
```

### 3. Refactor Dynamic Form Component

Update `DynamicFormComponent` to use the unified config and element:

- **dynamic-form.component.ts**:
  - Remove imports of `cityList`, `countryList`, `CitySelectComponent`, `CountrySelectComponent`.
  - Import `DataListSelectComponent` and `LOCATION_SELECT_CONFIG`.
  - Add `LOCATION_SELECT_CONFIG` to component imports list.
  - Define class property `selectConfigs = LOCATION_SELECT_CONFIG;` and remove local `countries` / `cities` properties.

- **dynamic-form.component.html**:
  - Replace the conditional `@if (listDataType === 'country')` block with:

    ```html
    @let listDataType = field.listDataType || 'city';
    @let config = selectConfigs[listDataType];

    <app-data-list-select
      [formField]="formField"
      [label]="label"
      [fieldName]="fieldName"
      [placeholder]="config.placeholder"
      [items]="config.items"
      [trackByFn]="config.trackBy"
      [valueFn]="config.value"
      [labelFn]="config.label"
    />
    <app-form-field-error [formField]="formField" />
    ```

### 4. Remove Obsolete Components

Delete:

- `src/app/shared/ui/form/city-select/`
- `src/app/shared/ui/form/country-select/`

## Verification

- Run `npx tsc --noEmit` to verify type-checking succeeds for generic template inference.
- Run `npm run lint` to verify syntax and formatting standards.
