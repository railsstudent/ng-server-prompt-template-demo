import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-form-field-error',
  template: ` @if (showErrors()) {
    @for (e of errors(); track $index) {
      <p>{{ e.message }}</p>
    }
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormFieldErrorComponent {
  formField = input.required<FieldTree<unknown, string>>();

  showErrors = computed(() => {
    const fieldTree = this.formField();
    const fieldState = fieldTree();
    return (fieldState.touched() || fieldState.dirty()) && fieldState.invalid();
  });

  errors = computed(() => {
    const fieldTree = this.formField();
    const fieldState = fieldTree();
    return fieldState.errors();
  });
}
