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

import { provideAIModels } from './ai/ai-models.provider';
import { ConfigService } from './ai/services/config.service';
import { TemplateConfigService } from './ai/services/template-config.service';
import { routes } from './app.routes';
import { GlobalStateService } from './shared/ui/services/global-state.service';

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
        service.errorMsg.set(error.error?.['message'] || 'Unknown Navigation Error');
        inject(Router).navigate(['/error'], {
          skipLocationChange: true,
        });
      }),
    ),
    provideAppInitializer(async () => {
      const configService = inject(ConfigService);
      const remoteConfigService = inject(TemplateConfigService);
      await configService.initialize();
      remoteConfigService.updateTemplateIds(configService.remoteConfig);
    }),
    provideAIModels(),
  ],
};
