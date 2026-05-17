import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import countryList from '@/public/countries.json';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import FormFieldErrorComponent from '../form-field-error/form-field-error.component';

@Component({
  selector: 'app-dynamic-form',
  imports: [FormField, FormFieldErrorComponent],
  template: ` <div class="w-full max-w-xl mx-auto">
    <form novalidate>
      @for (field of formFieldMetadata(); track field.fieldName) {
        @let fieldName = field.fieldName;
        @let inputControl = field.inputControl;
        @let label = field.label || 'Label:';
        @let inputType = field.inputType || 'text';
        @let formField = $any(signalForm())[fieldName];

        @if (inputControl === 'input') {
          <label [for]="fieldName">
            <span>{{ label }}</span>
            <input [id]="fieldName" [type]="inputType" [formField]="$any(formField)" />
          </label>
          <app-form-field-error [formField]="formField" />
        } @else if (inputControl === 'textarea') {
          <label [for]="fieldName">
            <span>{{ label }}</span>
            <textarea [id]="fieldName" [formField]="$any(formField)" rows="5"></textarea>
          </label>
          <app-form-field-error [formField]="formField" />
        } @else if (inputControl === 'select') {
          @let listDataType = field.listDataType || '';
          @if (listDataType === 'country') {
            <label [for]="fieldName">
              <span>{{ label }}:</span>
              <select [id]="fieldName" [formField]="$any(formField)">
                @for (c of countries; track c.code) {
                  <option [value]="c.name">{{ c.name }}</option>
                }
              </select>
            </label>
            <app-form-field-error [formField]="formField" />
          }
        }
      }
      <button type="submit" [disabled]="isBtnDisabled()" (click)="btnClicked.emit($event)">
        Generate
      </button>
    </form>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DynamicFormComponent {
  formFieldMetadata = input.required<FormFieldMetadata[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signalForm = input.required<any>();
  isBtnDisabled = input.required<boolean>();
  btnClicked = output<Event>();

  countries = countryList.countries;
}
