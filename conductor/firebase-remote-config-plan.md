# Firebase Remote Config Integration Plan

## Objective

Set up a dedicated Firebase workspace for CLI tooling targeted at the `vertexai-prompt-templates` project. Architect a centralized initialization for the Firebase App, AppCheck, and Remote Config using a root-provided `ConfigService`. This service will guarantee singleton instantiation, perform initial setup during app startup, and keep references to the `#appInstance` and `#remoteConfig` for application-wide reuse.

## Scope

1. **Firebase Workspace Setup**: Create an isolated `firebase-workspace` directory and configure the Firebase CLI for the target project, including downloading Remote Config defaults.
2. **Centralized Service Setup**:
   - Create `src/app/ai/services/config.service.ts` (`providedIn: 'root'`) to encapsulate initialization and hold the references using private class fields.
3. **Refactor AI Provider**:
   - Rename `src/app/ai/ai.provider.ts` to `src/app/ai/ai-models.provider.ts`.
   - Update `provideAIModels` to inject the `ConfigService` to access the shared Firebase app instance.
4. **Angular App Initialization**:
   - Update `app.config.ts` to include `provideAppInitializer`.
   - Inject the `ConfigService` inside the initializer and trigger its initialization routine.
   - Ensure `provideAppInitializer` is placed before `provideAIModels()` in the `appConfig` providers array.

## Implementation Steps

### Phase 1: Firebase Workspace Initialization & Configuration

1. **Create Workspace Directory**:
   - Create a new folder named `firebase-workspace` at the root of the project.
2. **Initialize Firebase**:
   - Change directory to `firebase-workspace`.
   - Run `npx -y firebase-tools@latest use vertexai-prompt-templates` to set the active project.
   - Run `npx -y firebase-tools@latest init` to generate `.firebaserc` and `firebase.json` files within this directory.
3. **Download Remote Config Defaults**:
   - Retrieve the Remote Config template defaults explicitly for the correct project using the Firebase CLI (`npx -y firebase-tools@latest remoteconfig:get --project vertexai-prompt-templates -o remote_config_defaults.json`) and save this file inside the `firebase-workspace/` directory.

### Phase 2: Create Centralized ConfigService

1. **Create Service File**:
   - Create `src/app/ai/services/config.service.ts`:

     ```typescript
     import { Injectable, isDevMode } from '@angular/core';
     import { FirebaseApp, initializeApp } from 'firebase/app';
     import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
     import { getRemoteConfig, fetchAndActivate, RemoteConfig } from 'firebase/remote-config';
     import firebaseConfig from '../../../firebase.config.json';
     import rcDefaults from '../../../../firebase-workspace/remote_config_defaults.json';

     @Injectable({
       providedIn: 'root'
     })
     export class ConfigService {
       #appInstance: FirebaseApp | null = null;
       #remoteConfig: RemoteConfig | null = null;

       get app(): FirebaseApp {
         if (!this.#appInstance) {
           throw new Error('FirebaseApp is not initialized yet.');
         }
         return this.#appInstance;
       }

       get remoteConfig(): RemoteConfig {
         if (!this.#remoteConfig) {
           throw new Error('RemoteConfig is not initialized yet.');
         }
         return this.#remoteConfig;
       }

       async initialize(): Promise<void> {
         // Prevent double initialization
         if (this.#appInstance) {
           return;
         }

         // 1. Initialize App
         this.#appInstance = initializeApp(firebaseConfig);

         // 2. Initialize App Check
         if (firebaseConfig.recaptchaEnterpriseKey) {
           initializeAppCheck(this.#appInstance, {
             provider: new ReCaptchaEnterpriseProvider(firebaseConfig.recaptchaEnterpriseKey),
             isTokenAutoRefreshEnabled: true
           });
         } else {
           console.warn("⚠️ App Check was not initialized because RECAPTCHA_ENTERPRISE_KEY is missing.");
         }

         // 3. Initialize Remote Config
         this.#remoteConfig = getRemoteConfig(this.#appInstance);
         this.#remoteConfig.defaultConfig = rcDefaults;
         this.#remoteConfig.settings.minimumFetchIntervalMillis = isDevMode() ? 0 : 3600000;

         // 4. Fetch and Activate
         try {
           const activated = await fetchAndActivate(this.#remoteConfig);
           console.log('Remote Config initialized. Activated new values:', activated);
         } catch (error) {
           console.error('Failed to initialize Remote Config:', error);
         }
       }
     }
     ```

### Phase 3: Refactor AI Models Provider

1. **Rename File**: Rename `src/app/ai/ai.provider.ts` to `src/app/ai/ai-models.provider.ts`.
2. **Update Content**:
   - Use a factory provider to initialize the AI model, relying on the `inject` function to retrieve the `ConfigService` and access the `app`:

     ```typescript
     import { EnvironmentProviders, makeEnvironmentProviders, inject } from '@angular/core';
     import { getAI, getTemplateGenerativeModel, VertexAIBackend } from 'firebase/ai';
     import { ConfigService } from './services/config.service';
     import { SERVER_TEMPLATE_MODEL } from './constants/server-template-model.token';
     import firebaseConfig from '../../firebase.config.json';

     export function provideAIModels(): EnvironmentProviders {
       return makeEnvironmentProviders([
         {
           provide: SERVER_TEMPLATE_MODEL,
           useFactory: () => {
             const configService = inject(ConfigService);
             const ai = getAI(configService.app, {
               backend: new VertexAIBackend(firebaseConfig.vertexLocation)
             });
             return getTemplateGenerativeModel(ai);
           }
         }
       ]);
     }
     ```

### Phase 4: Angular Application Setup via App Initializer

1. **Update `src/app/app.config.ts`**:
   - Import necessary modules.
   - Configure the app initializer to trigger the `ConfigService` setup, ensuring it precedes `provideAIModels()`:

     ```typescript
     import { ApplicationConfig, provideZoneChangeDetection, provideAppInitializer, inject } from '@angular/core';
     import { provideRouter } from '@angular/router';

     import { routes } from './app.routes';
     import { provideAIModels } from './ai/ai-models.provider';
     import { ConfigService } from './ai/services/config.service';

     export const appConfig: ApplicationConfig = {
       providers: [
         provideZoneChangeDetection({ eventCoalescing: true }),
         provideRouter(routes),
         provideAppInitializer(() => {
           const configService = inject(ConfigService);
           return configService.initialize();
         }),
         provideAIModels(), // Placed strictly after provideAppInitializer
       ],
     };
     ```

## Verification & Testing

- Verify that `firebase-workspace` contains `.firebaserc`, `firebase.json`, and `remote_config_defaults.json`.
- Serve the Angular application (`ng serve`).
- Verify the app blocks rendering until Remote Config is successfully fetched (the `initialize()` Promise resolves).
- Verify that the AI provider successfully obtains the shared Firebase App instance from the `ConfigService` and functions correctly.
- Ensure AppCheck and Firebase App initialization logs appear only once.
