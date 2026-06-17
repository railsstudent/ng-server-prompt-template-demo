# Plan - Zod Metadata Schema Validation

Introduce Zod schemas to parse and validate JSON form metadata dynamically at runtime/compile-time, replacing unsafe type assertions.

## Proposed Changes

### 1. Create Zod Schema File
Create `src/app/core/form-generator/schemas/form-field-metadata.schema.ts` to define the Zod schemas matching the existing TypeScript interfaces:
- `validationConfigSchema` (maps to `ValidationConfig`)
- `formFieldMetadataSchema` (maps to `FormFieldMetadata`)
- `metadataRecordSchema` (maps to `Record<string, FormFieldMetadata>`)

### 2. Refactor Metadata Mapping Constant
Update `src/app/core/constants/metadata-mapping.const.ts`:
- Import `metadataRecordSchema`.
- Validate dynamic imports using `metadataRecordSchema.parse()`.
- Eliminate the `as unknown as Record<string, FormFieldMetadata>` assertions.

### 3. Verification
- Compile the application (`npm run build` or `ng build`).
- Verify form generation and routing functions correctly.
