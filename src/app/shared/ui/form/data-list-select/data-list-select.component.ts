import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-data-list-select',
  templateUrl: './data-list-select.component.html',
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
  optionValueFn = input.required<(item: T) => string>();
  optionLabelFn = input.required<(item: T) => string>();

  onSelectionChange(event: Event) {
    event.preventDefault();
    if (event.target) {
      const element = event.target as HTMLSelectElement;
      this.value.set(element.value || '');
    }
  }
}
