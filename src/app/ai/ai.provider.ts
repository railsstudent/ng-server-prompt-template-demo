import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { getAI, getTemplateGenerativeModel, VertexAIBackend } from 'firebase/ai';
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import firebaseConfig from '../../firebase.config.json';
import { SERVER_TEMPLATE_MODEL } from './constants/server-template-model.token';

// 2. Create the Provider Function
export function provideAIModels(): EnvironmentProviders {
  const app = initializeApp(firebaseConfig);

  // Initialize App Check (Mandatory for Vertex AI)
  if (firebaseConfig.recaptchaEnterpriseKey) {
     initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(firebaseConfig.recaptchaEnterpriseKey),
      isTokenAutoRefreshEnabled: true
     });
  } else {
     console.warn("⚠️ App Check was not initialized because RECAPTCHA_ENTERPRISE_KEY is missing in .env.");
  }

  // Initialize AI with Vertex AI Backend and Location
  const ai = getAI(app, {
    backend: new VertexAIBackend(firebaseConfig.vertexLocation)
  });

  const model = getTemplateGenerativeModel(ai);

  return makeEnvironmentProviders([
    {
      provide: SERVER_TEMPLATE_MODEL,
      useValue: model
    }
  ]);
}
