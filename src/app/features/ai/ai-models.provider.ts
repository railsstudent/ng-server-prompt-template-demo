import firebaseConfig from '@/firebase.config.json';
import { EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';
import { getAI, getTemplateGenerativeModel, VertexAIBackend } from 'firebase/ai';
import { SERVER_TEMPLATE_MODEL } from './constants/server-template-model.token';
import { ConfigService } from './services/config.service';

// 2. Create the Provider Function
export function provideAIModels(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SERVER_TEMPLATE_MODEL,
      useFactory: () => {
        const configService = inject(ConfigService);
        const ai = getAI(configService.app, {
          backend: new VertexAIBackend(firebaseConfig.vertexLocation),
        });
        return getTemplateGenerativeModel(ai);
      },
    },
  ]);
}
