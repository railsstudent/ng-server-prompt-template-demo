import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAIModels } from './ai/ai-models.provider';
import { ConfigService } from './ai/services/config.service';
import { TemplateConfigService } from './ai/services/template-config.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAppInitializer(async () => {
      const configService = inject(ConfigService);
      const remoteConfigService = inject(TemplateConfigService);
      await configService.initialize();
      remoteConfigService.updateTemplateIds(configService.remoteConfig);
    }),
    provideAIModels(),
  ],
};
