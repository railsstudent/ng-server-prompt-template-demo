# Scalable Dynamic Form Typing Plan

## Objective

Implement a highly scalable, generic TypeScript utility that automatically infers strongly-typed form models directly from the declarative `FormFieldMetadata` constant records. The generated form model will use the exact literal string of `fieldName` as the key, and map the `fieldType` string literal (e.g., `'string'`, `'number'`) to actual TypeScript types (`string`, `number`, etc.). Furthermore, the data generation utility will be strictly typed to return these exact models.

## Key Files & Context

- **New Type**: `src/app/core/form-generator/types/dynamic-form-model.type.ts`
- **Utility**: `src/app/core/form-generator/utils/generate-form-model.util.ts`
- **Constants**:
  - `src/app/features/country-form/constants/metadata-list.const.ts`
  - `src/app/features/historic-event-form/constants/metadata-list.const.ts`

## Implementation Steps

### 1. Create Generic Form Model Type

Update the file `dynamic-form-model.type.ts`:

- Define a type map to translate string literals to actual types:

  ```typescript
  type FieldTypeMap = {
    'string': string;
    'number': number;
    'string[]': string[];
    'number[]': number[];
  };
  ```

- Define `DynamicFormModelFromRecord<T extends Record<string, FormFieldMetadata>>`.
- Use a mapped type to iterate over `keyof T`, mapping the key to `T[Key]['fieldName']`.
- Assign the precise value type using the map: `FieldTypeMap[T[Key]['fieldType']]`.

### 2. Update Model Generator Utility

Modify `generate-form-model.util.ts`:

- Update `generateFormModelData` to be a generic function that accepts the metadata record directly and returns the strongly-typed model.
- Signature:

  ```typescript
  export function generateFormModelData<T extends Record<string, FormFieldMetadata>>(
    metadataRecord: T
  ): DynamicFormModelFromRecord<T>
  ```

- Implementation: Inside the function, cast the initial `{}` to `DynamicFormModelFromRecord<T>` and iterate over `Object.values(metadataRecord)` to populate the initial state, ensuring the output fully satisfies component-specific models like `CountryFormModel` or `HistoricEventFormModel`.

### 3. Refactor Form Metadata Constants & Types

Modify `country-form` and `historic-event-form` configurations:

- Define constants using `as const satisfies Record<string, FormFieldMetadata>`.
- Ensure all items declare a valid `fieldType`.
- Generate the final component types using `DynamicFormModelFromRecord` in their respective `types/` directories.

## Verification

- Run `npm run lint` and the TypeScript compiler (`npx tsc --noEmit`) to ensure the exact field names, precise value types (string, number, arrays), and strictly-typed generator functions are correctly inferred.
