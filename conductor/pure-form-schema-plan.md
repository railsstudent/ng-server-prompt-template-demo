# Pure Dynamic Form Function Plan

## Objective
Encapsulate the boilerplate `form(model, (schemaPath) => { ... })` setup into a reusable, generic pure function. Additionally, clean up the TypeScript types in the validation utilities to remove the `eslint-disable` comments for `any`, ensuring strict and compliant typing.

## Key Files & Context
- **New/Updated Utility**: `src/app/core/form-generator/utils/create-dynamic-form.util.ts` (or append to existing form util)
- **Validation Utility**: `src/app/core/form-generator/utils/generate-custom-validation.util.ts`
- **Components**:
  - `src/app/features/country-form/country-form.component.ts`
  - `src/app/features/historic-event-form/historic-event-form.component.ts`

## Implementation Steps

### 1. Resolve `any` in Validation Utility
Update `generate-custom-validation.util.ts`:
- Remove `// eslint-disable-next-line @typescript-eslint/no-explicit-any` from `ValidatorApplier` and `setUpSchemaForPath` and `setUpFormSchema`.
- Change the `path: any` parameters to `path: unknown`.
- Inside the `VALIDATOR_REGISTRY`, when passing the `path` to strict Angular validators like `maxLength` or `min`, use proper type assertions (e.g., `path as SchemaPath<string>`) to satisfy Angular's compiler constraints (`ValueWithLengthOrSize` / `string | number | null`) without using the forbidden `any` type.

### 2. Create `createDynamicForm` Utility
Add a new pure function (e.g., in `generate-form-model.util.ts` or a new file):
- Signature:
  ```typescript
  import { WritableSignal } from '@angular/core';
  import { FieldTree, form } from '@angular/forms/signals';

  export function createDynamicForm<TRecord extends Record<string, FormFieldMetadata>>(
    modelSignal: WritableSignal<DynamicFormModelFromRecord<TRecord>>,
    metadataRecord: TRecord
  ): FieldTree<DynamicFormModelFromRecord<TRecord>>
  ```
- Implementation:
  ```typescript
  return form(modelSignal, (schemaPath) => {
    setUpFormSchema(schemaPath, metadataRecord);
  });
  ```

### 3. Refactor Components
Update `CountryFormComponent` and `HistoricFormComponent`:
- Replace the manual `countryForm = form(...)` setup with the new 1-liner:
  ```typescript
  countryForm = createDynamicForm(this.countryModel, COUNTRY_FORM_METADATA);
  ```
- Do the same for `historicEventForm`.

## Verification
- Run `npm run lint` to confirm that NO `eslint-disable` comments remain for `any` and that the strict types are accepted.
- Run `npx tsc --noEmit` to ensure the type assertions resolve Angular's generic constraints.
- Ensure the components compile and build cleanly.