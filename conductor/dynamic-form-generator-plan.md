# Dynamic Form Generator Plan

## Objective

Design and implement types and pure utility functions to remove boilerplate code when setting up form models and validation schemas with `@angular/forms/signals`. The user will handle the final schema wiring in the components manually.

## Key Files & Context

- **Types**:
  - `src/app/core/form-generator/types/form-field-validation.type.ts`
  - `src/app/core/form-generator/types/form-field-metadata.type.ts`
- **Utils**:
  - `src/app/core/form-generator/utils/generate-custom-validation.util.ts`
  - `src/app/core/form-generator/utils/generate-form-model.util.ts`
- **Constants**:
  - `src/app/features/country-form/constants/metadata-list.const.ts`
  - `src/app/features/historic-event-form/constants/metadata-list.const.ts`

## Implementation Steps

### 1. Define Validation Configuration Type

Create `FormFieldValidationConfig` in `form-field-validation.type.ts`:

- `isRequired?: boolean`
- `requiredErrorMsg?: string` (default 'This field is required')
- `maxLength?: number`
- `maxLengthErrorMsg?: string` (default 'Maximum length exceeded')
- `minLength?: number`
- `minLengthErrorMsg?: string` (default 'Minimum length not met')
- `min?: number`
- `minErrorMsg?: string` (default 'Minimum value not met')
- `max?: number`
- `maxErrorMsg?: string` (default 'Maximum value exceeded')
- `debounce?: number`

### 2. Define Form Field Metadata Type

Create `FormFieldMetadata` in `form-field-metadata.type.ts`:

- `field_name: string`
- `initialValue: string | number`
- `inputControl: 'input' | 'textarea' | 'select'`
- `type: 'text' | 'number'`
- `fieldValidatorConfig?: ValidationConfig`
- `listDataType?: 'country'`

### 3. Implement Utility Functions

**A. `setUpSchemaForPath<T>(path: SchemaPath<T>, config?: ValidationConfig)` in `generate-custom-validation.util.ts`:**

- Adds validation to a schema path using `@angular/forms/signals` (`required`, `maxLength`, `minLength`, `min`, `max`, `debounce`).
- If a property like `isRequired` is true, calls `required(path, { message: ... })`.
- Handles numerical validations (e.g., `maxLength`, `min`) if they are defined and > 0, applying fallback default error messages if none are provided.

**B. `generateFormModelData(metadataList: FormFieldMetadata[])` in `generate-form-model.util.ts`:**

- Returns the initial model object of type `Record<string, unknown>`.
- Iterates through the provided `metadataList`.
- Maps `[field_name]` to `initialValue`.
- If `listDataType` is `'country'`, it checks `public/countries.json` for a match (either by name or code). If found, uses `initialValue`, otherwise defaults to `''`.

### 4. Create Metadata Constants

Create the constant metadata list files for the components (the user will manually wire up the schemas):

- `src/app/features/country-form/constants/metadata-list.const.ts`: Define the `metadataList` for `CountryFormComponent`.
- `src/app/features/historic-event-form/constants/metadata-list.const.ts`: Define the `metadataList` for `HistoricFormComponent`.

## Verification & Testing

- Ensure the TypeScript compiler passes and no typing errors exist around the new schema setup.
- Verify `countries.json` lookup resolves correctly.
