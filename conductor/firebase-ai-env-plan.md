# Implementation Plan: Integrate Firebase AI Logic with Native Node.js `.env` Configuration

## Objective

To securely and dynamically configure Firebase AI Logic (Vertex AI Gemini API) in the Angular application by leveraging Node.js 24's native environment variable loading (`process.loadEnvFile`). This plan outlines creating an environment template, writing a generation script, updating the build pipeline, and initializing Firebase within Angular.

## Key Files & Context

- `.env.example`: Template defining required environment variables.
- `.env`: The local environment file containing actual secrets (will be ignored).
- `src/firebase.config.json`: The generated JSON configuration file (will be ignored).
- `scripts/generate-firebase-config.js`: The Node.js script that parses `.env` and generates the JSON configuration.
- `package.json`: Contains the updated npm scripts to automate config generation.
- `.gitignore`: Updated to prevent committing sensitive files.
- `tsconfig.json`: Ensuring JSON module resolution is enabled.
- `src/app/services/firebase-ai.service.ts`: Angular service that initializes Firebase and the AI Logic SDK.

## Implementation Steps

### 1. Create Environment Variable Template (`.env.example`)

Create a `.env.example` file in the project root with the following placeholders:

```env
# .env.example
FIREBASE_VERTEX_LOCATION=global
RECAPTCHA_ENTERPRISE_KEY=your_recaptcha_site_key
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Update `.gitignore`

Add the environment file and the generated configuration JSON to `.gitignore` to prevent sensitive data from being committed to GitHub.

```gitignore
# Firebase & Environment Config
.env
src/firebase.config.json
```

### 3. Create the Configuration Generation Script

Create a Node.js script at `scripts/generate-firebase-config.js`. This script utilizes Node 24's native `process.loadEnvFile()` to read the `.env` file and outputs the configuration to `src/firebase.config.json`.

```javascript
// scripts/generate-firebase-config.js
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

// Check if .env exists before attempting to load it
if (fs.existsSync(envPath)) {
    // Requires Node.js 20.6.0+ / 22+ / 24+
    process.loadEnvFile(envPath);
} else {
    console.warn('⚠️  No .env file found. Falling back to system environment variables.');
}

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  recaptchaEnterpriseKey: process.env.RECAPTCHA_ENTERPRISE_KEY,
  vertexLocation: process.env.FIREBASE_VERTEX_LOCATION
};

// Validate that critical variables are present (optional but recommended)
if (!config.apiKey || !config.projectId) {
    console.error('❌ Missing critical Firebase configuration in environment variables.');
    process.exit(1);
}

const targetPath = path.resolve(process.cwd(), 'src/firebase.config.json');

fs.writeFileSync(targetPath, JSON.stringify(config, null, 2), 'utf-8');
console.log('✅ Firebase configuration generated successfully at ' + targetPath);
```

### 4. Update NPM Scripts in `package.json`

Modify `package.json` to include the script execution as a pre-hook for the `start` and `build` commands.

```json
  "scripts": {
    "ng": "ng",
    "config": "node scripts/generate-firebase-config.js",
    "prestart": "npm run config",
    "start": "ng serve",
    "prebuild": "npm run config",
    "build": "ng build",
    // ... remaining scripts
  }
```

### 5. Ensure JSON Module Resolution in `tsconfig.json`

Verify or add `"resolveJsonModule": true` under `compilerOptions` in `tsconfig.json` so Angular can import the generated JSON file seamlessly.

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    // ...
  }
}
```

### 6. Initialize Firebase and AI Logic in Angular

We will create a provider function to initialize Firebase and provide the `TemplateGenerativeModel` via an injection token.

Create `src/app/ai.provider.ts`:

```typescript
import { InjectionToken, makeEnvironmentProviders, EnvironmentProviders } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAI, getTemplateGenerativeModel, VertexAIBackend } from 'firebase/ai';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

// Import the generated configuration
import firebaseConfig from '../firebase.config.json';

// 1. Define the Injection Token
export const SERVER_TEMPLATE_MODEL = new InjectionToken<ReturnType<typeof getTemplateGenerativeModel>>(
  'SERVER_TEMPLATE_MODEL'
);

// 2. Create the Provider Function
export function provideAIModels(): EnvironmentProviders {
  const app = initializeApp(firebaseConfig);

  // Initialize App Check (Mandatory for Vertex AI)
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(firebaseConfig.recaptchaEnterpriseKey),
    isTokenAutoRefreshEnabled: true
  });

  // Initialize AI with Vertex AI Backend and Location
  const ai = getAI(app, { 
    backend: new VertexAIBackend({ location: firebaseConfig.vertexLocation })
  });

  const model = getTemplateGenerativeModel(ai);

  return makeEnvironmentProviders([
    {
      provide: SERVER_TEMPLATE_MODEL,
      useValue: model
    }
  ]);
}
```

### 7. Provide AI Models in `app.config.ts`

Update `src/app/app.config.ts` to include the new `provideAIModels()` provider.

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAIModels } from './ai.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAIModels() // Add this line
  ]
};
```

## Verification & Testing

1. Copy `.env.example` to `.env` and populate it with valid Firebase credentials.
2. Run `npm run config` manually to verify the script executes without errors and generates `src/firebase.config.json` correctly.
3. Run `npm start` to confirm the `prestart` hook successfully triggers the script before starting the Angular development server.
4. In a component, inject the model: `private model = inject(SERVER_TEMPLATE_MODEL);`
5. Perform a test call: `this.model.generateContent('template-id', { var1: 'value' })` to verify connectivity.
