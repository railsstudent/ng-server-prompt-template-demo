# File Uploader Component Implementation Plan

## Objective

Create a reusable, standalone Angular file uploader component (`FileUploaderComponent`) that supports drag-and-drop, click-to-browse, image previews, robust file validation, inline error rendering, and internal file-read progress visualization. The component uses the `FileReader` API for progress tracking and ensures modern memory management via `DestroyRef`.

## Architecture

* **Location:** `src/app/ui/file-uploader/`
* **Component Type:** Standalone, `ChangeDetectionStrategy.OnPush`.
* **Access Control:** Use `protected` for signals and methods used in the HTML template. Use `private` for truly internal logic.
* **State Management:** Angular Signals for reactive internal state.
* **Communication:** Custom Angular `output()` to emit the selected file.
* **Global State:** Inject `GlobalStateService` to report validation/selection errors.
* **Lifecycle Management:** Inject `DestroyRef` to handle cleanup and memory release.
* **File Reading:** Utilize `FileReader` API for internal progress and preview generation.

## Implementation Steps

### 1. Create Component Files & Icons

* Create `src/app/ui/file-uploader/file-uploader.component.ts`, `.html`, `.css`.
* Create `src/app/ui/icons/trash-icon.component.ts` and `src/app/ui/icons/upload-icon.component.ts`.

### 2. Component Logic (`file-uploader.component.ts`)

* **Constants & Injectables:**
  * `const KILOBYTES = 1024;`
  * Inject `GlobalStateService`.
  * Inject `DestroyRef`.
* **Inputs & Outputs:**
  * `maxSize = input(20 * KILOBYTES * KILOBYTES)`
  * `fileChanged = output<File | undefined>()`
* **State Signals (Protected):**
  * `protected isDragOver = signal(false)`
  * `protected previewUrl = signal<string | undefined>(undefined)`
  * `protected uploadProgress = signal<number | null>(null)`
* **Internal State (Private):**
  * `private acceptedTypes = ['PNG', 'JPG', 'JPEG', 'WEBP']`
  * `private currentReader: FileReader | null = null;`
* **Computed Signals (Protected):**
  * `protected helperText = computed(() => { ... })`
  * `protected hasError = computed(() => this.stateService.isError())`
  * `protected errorMessage = computed(() => this.stateService.errorMsg() || 'An unknown error occurred.')`
* **Constructor Cleanup Logic:**
  * Call `this.destroyRef.onDestroy(() => { ... })`.
  * Inside: Call `this.currentReader?.abort()`, then explicitly set `this.currentReader = null` and nullify `previewUrl` to ensure references are cleared for GC.
* **Validation Method (`private validateFile(file: File): boolean`):**
  * Check lowercase extension and size. Update global state if invalid.
* **File Processing (`private processFile(file: File)`):**
  * Abort and clear any `currentReader`.
  * Reset `uploadProgress(0)`.
  * Initialize `new FileReader()`, assigning it to `currentReader`.
  * Setup `onprogress` to update the signal.
  * Setup `onload` to set `previewUrl`, clear progress, and emit `fileChanged`.
  * Call `readAsDataURL(file)`.
* **Event Handlers (Protected):**
  * `onDrop` / `onFileSelect`: Validate and process.
  * `removeFile(event)`: Stop propagation, abort reader, reset signals, emit `undefined`.

### 3. Component Template (`file-uploader.component.html`)

* **Drop Zone Container:** Remains fully interactive.
* **Hidden File Input.**
* **Progress Bar:** Absolutely positioned at the bottom, active during the `FileReader` phase.
* **Main Content Area:**
  * Always show the `upload-icon` and `helperText`.
  * `@if (hasError())`: Show red error message.
  * `@if (previewUrl(); as url)`: Show image and `trash-icon`.

### 5. Integration (`src/app/home/home.component.ts`, `.html`)

* **TS:** Import `FileUploaderComponent` into the `imports` array.
* **HTML:** Insert `<app-file-uploader (fileChanged)="onFileChanged($event)" />` into the template.
* **Logic:** Add an `onFileChanged(file: File | undefined)` method to log or handle the emitted file, enabling manual testing.

## Verification

1. Verify `DestroyRef` callback executes when navigating away from the component.
2. Verify `FileReader.onprogress` reflects accurately in the UI.
3. Verify memory usage remains stable after multiple file overwrites.
4. Ensure `protected` visibility allows correct template binding without AOT errors.
