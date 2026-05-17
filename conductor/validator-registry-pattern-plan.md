# Validator Registry Pattern Implementation Plan

## Objective

Elevate the form generator architecture to a "Level 9" status by replacing the hardcoded imperative validation logic with a declarative **Registry Pattern**. This ensures the system is "Open for Extension but Closed for Modification" (Open-Closed Principle).

## Key Files & Context

- **Utility**: `src/app/core/form-generator/utils/generate-custom-validation.util.ts`
- **Configuration Type**: `src/app/core/form-generator/types/form-field-validation.type.ts`

## Implementation Steps

### 1. Define Validator Registry Type

Inside `generate-custom-validation.util.ts`:

- Define a type `ValidatorApplier = (path: any, config: ValidationConfig) => void`.
- Create a private `VALIDATOR_REGISTRY` constant of type `Partial<Record<keyof ValidationConfig, ValidatorApplier>>`.

### 2. Populate the Registry

Map each configuration key to its respective `@angular/forms/signals` validator function:

- `isRequired` -> calls `required()`
- `maxLength` -> calls `maxLength()`
- `minLength` -> calls `minLength()`
- `min` -> calls `min()`
- `max` -> calls `max()`
- `debounce` -> calls `debounce()`
- Ensure each applier handles its own "should I apply?" check (e.g., checking if the value is defined and > 0).

### 3. Refactor Core Utility Function

Rewrite `setUpSchemaForPath`:

- Remove the long list of `if` statements.
- Implementation:

  ```typescript
  export function setUpSchemaForPath(path: any, config?: ValidationConfig): void {
    if (!config) return;
    
    // Iterate over the keys provided in the user's config
    (Object.keys(config) as Array<keyof ValidationConfig>).forEach(key => {
      // Look up the applier in the registry and execute it if found
      VALIDATOR_REGISTRY[key]?.(path, config);
    });
  }
  ```

### 4. Cleanup & Optimization

- Ensure `eslint-disable` comments are applied correctly for the `any` path parameter.
- Ensure the TypeScript compiler is satisfied with the key casting.

## Benefits

- **Extensibility**: Adding a new validator (e.g., `email`, `pattern`) now only requires adding one entry to the `VALIDATOR_REGISTRY` map, rather than modifying the core execution flow.
- **Maintainability**: The core logic is reduced from a growing list of conditions to a single, stable loop.
- **Scalability**: The system can now handle an arbitrary number of validation types without increasing cyclomatic complexity.

## Verification

- Run `npm run lint` to confirm no new linting errors.
- Run `npx tsc --noEmit` to verify type safety.
- Manually verify that `CountryFormComponent` and `HistoricFormComponent` still apply validations (required, minLength, debounce) correctly via the new registry flow.
