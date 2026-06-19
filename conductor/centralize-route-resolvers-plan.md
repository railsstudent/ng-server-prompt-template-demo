# Plan - Centralize Route Resolvers Logic

Centralize the path-based lookup and data retrieval logic inside `src/app/resolvers/routes.resolver.ts` to reduce duplication and improve maintainability of the route resolvers.

## Proposed Changes

### 1. Update `src/app/resolvers/routes.resolver.ts`

Introduce a centralized private helper function `getRouteResolverData(url: string)` inside the file.

- The function will:
  - Call `findNavItemByPath(url)` to get the `NavItem` or `undefined`.
  - Inject `NavService` to retrieve metadata via `navService.findMetadataByPath(url)`.
  - Return an object containing:
    - `title`: `!item ? 'Edit An Image' : item.title`
    - `pageTitle`: `item?.pageTitle || 'Edit An Image'`
    - `templateKeyId`: `item?.templateKeyId`
    - `metadata`: `metadata`
- Refactor the existing resolvers to call `getRouteResolverData`:
  - `editeRouteTitleResolver`
  - `editePageTitleTemplateKeyIdResolver`
  - `metadataResolver`

### 2. Verification

- Run local compilation checks (`npm run build` or `ng build`).
- Verify routing works correctly and page titles, template configurations, and forms load with their expected data.
