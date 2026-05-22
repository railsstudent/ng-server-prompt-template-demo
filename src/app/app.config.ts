import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  NavigationError,
  provideRouter,
  Router,
  withComponentInputBinding,
  withNavigationErrorHandler,
  withViewTransitions,
} from '@angular/router';

import { provideAIModels } from './features/ai/ai-models.provider';
import { ConfigService } from './features/ai/services/config.service';
import { TemplateConfigService } from './features/ai/services/template-config.service';
import { routes } from './app.routes';
import { GlobalStateService } from './shared/services/global-state.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withNavigationErrorHandler((error: NavigationError) => {
        console.log('withNavigationErrorHandler triggered', 'url: ', error.url);
        const service = inject(GlobalStateService);
        service.setError(error.error?.['message'] || 'Unknown Navigation Error');
        inject(Router).navigate(['/error'], {
          skipLocationChange: true,
        });
      }),
    ),
    provideAppInitializer(async () => {
      const configService = inject(ConfigService);
      const templateConfigService = inject(TemplateConfigService);
      await configService.initialize();
      templateConfigService.updateTemplateIds(configService.remoteConfig);
      templateConfigService.setupRemoteConfigListener(configService.remoteConfig);
    }),
    provideAIModels(),
  ],
};
