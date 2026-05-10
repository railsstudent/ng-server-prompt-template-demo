# Layout Design Implementation Plan (Tailwind CSS v4)

## Objective

Enhance the layout by implementing a collapsible, hover-to-expand Side Navigation, differentiating the background colors for better visual hierarchy, and refactoring the CSS architecture to use component-specific stylesheets with Tailwind CSS v4's `@reference` directive.

## Target Theme & Architecture

* **CSS Architecture:** Move inline Tailwind classes (`class="..."`) into component specific `.css` files. Use `@reference` to link `styles.css` and `@apply` for utility composition.
* **Color Palette (Differentiated):**
  * **Header:** `bg-indigo-500` (Primary brand color).
  * **SideNav:** `bg-indigo-800` (Darker shade for depth and contrast).
  * **Footer:** `bg-slate-800` (Neutral dark shade to anchor the page).
* **SideNav Behavior:** Starts minimized (`w-16`), expands on hover (`hover:w-64`). Uses SVG icons so that visual cues remain when collapsed, while text is safely hidden using `overflow-hidden`.

## Implementation Steps

### 1. Create Icon Components (`src/app/ui/icons/`)

Generate standalone components for each navigation item to house inline SVG code. This keeps the SideNav HTML clean and allows for easy reuse.

* `home-icon.component`
* `bottle-icon.component` (Glass Bottle Souvenir)
* `figurine-icon.component`
* `map-icon.component` (3D Map)
* `car-icon.component` (Diecast Vehicle)
* `flag-icon.component` (Country)
* `history-icon.component` (Historic Events)
* *Implementation detail:* Each component will have `selector: 'app-[name]-icon'` and an inline SVG template with `currentColor` for fill/stroke.

### 2. Update Side Navigation (`src/app/ui/side-nav/side-nav.component.html`, `.ts`, `.css`)

* **TS:** Import the new icon components into the `SideNavComponent` imports array.
* **HTML:** Refactor links to use Flexbox, placing the icon alongside the text. Add `aria-label` for accessibility when the text is visually hidden.

    ```html
    <div class="nav-header">
      <!-- Short title/logo when collapsed, full title when expanded -->
      <span class="nav-title-icon">ITH</span>
      <span class="nav-title-text">Intelligent Task Hub</span>
    </div>
    <ul class="nav-list">
      <li>
        <a href="#" class="nav-link" aria-label="Home">
          <app-home-icon class="nav-icon" />
          <span class="nav-text">Home</span>
        </a>
      </li>
      <!-- ... repeat for other links ... -->
    </ul>
    ```

* **CSS (`side-nav.component.css`):**

    ```css
    @reference "../../../styles.css";

    :host {
      @apply flex flex-col h-full bg-indigo-800 text-white shadow-md transition-all duration-300 w-16 hover:w-64 overflow-hidden whitespace-nowrap;
    }
    .nav-header {
      @apply flex items-center p-4 mb-6;
    }
    .nav-title-icon {
      @apply font-bold text-xl min-w-[2rem] text-center;
    }
    .nav-title-text {
      @apply font-bold text-xl ml-4 transition-opacity duration-300 opacity-0;
    }
    :host(:hover) .nav-title-text {
      @apply opacity-100;
    }
    .nav-list {
      @apply flex flex-col;
    }
    .nav-link {
      @apply flex items-center py-3 px-4 hover:bg-indigo-700 hover:text-indigo-100 transition-colors;
    }
    .nav-icon {
      @apply w-6 h-6 flex-shrink-0 flex items-center justify-center;
    }
    .nav-text {
      @apply ml-4 transition-opacity duration-300 opacity-0;
    }
    :host(:hover) .nav-text {
      @apply opacity-100;
    }
    ```

### 2. Update Header (`src/app/ui/header/header.component.html`, `.ts`, `.css`)

* **TS:** Add `styleUrl: './header.component.css'` to the `@Component` decorator.
* **HTML:** Clean up inline classes, replacing with semantic classes (e.g., `header-container`, `header-title`, `header-status`).
* **CSS (`header.component.css`):**

    ```css
    @reference "../../../styles.css";

    :host {
      @apply block;
    }
    .header-container {
      @apply bg-indigo-500 text-white p-4 shadow-md flex justify-between items-center;
    }
    .header-title {
      @apply text-xl font-bold;
    }
    .header-status-badge {
      @apply text-sm bg-indigo-700 px-2 py-1 rounded;
    }
    ```

### 3. Update Footer (`src/app/ui/footer/footer.component.ts`, `.css`)

* **TS:** Extract the inline template to `footer.component.html` and add `styleUrl: './footer.component.css'`.
* **HTML:** Use a semantic class `footer-container`.
* **CSS (`footer.component.css`):**

    ```css
    @reference "../../../styles.css";

    .footer-container {
      @apply bg-slate-800 mt-auto container mx-auto px-6 py-4 text-center text-slate-300;
    }
    ```

### 4. Update Home Component (`src/app/home/home.component.html`, `.ts`, `.css`)

* **TS:** Add `styleUrl: './home.component.css'`.
* **HTML:** Use semantic classes.
* **CSS (`home.component.css`):**

    ```css
    @reference "../../../styles.css";
    
    .home-card {
      @apply bg-white rounded-lg shadow p-6 border border-indigo-100;
    }
    .home-title {
      @apply text-2xl font-bold text-indigo-500 mb-4;
    }
    .home-text {
      @apply text-gray-700;
    }
    ```

## Verification

1. Review the UI to ensure the Sidebar expands smoothly from `w-16` to `w-64` on hover without breaking the flex layout of the main content.
2. Confirm the colors (Header: Indigo-500, SideNav: Indigo-800, Footer: Slate-800) provide good contrast.
3. Verify that `styles.css` is properly referenced using `@reference` in all new component stylesheets and Tailwind compilation succeeds without errors.
