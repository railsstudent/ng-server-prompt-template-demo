import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { setupRemoteConfigListener } from './ai/listeners/remote-config.listener';
import { ConfigService } from './ai/services/config.service';
import { ServerPromptService } from './ai/services/server-prompt.service';
import { TemplateConfigService } from './ai/services/template-config.service';
import { GlobalStateService } from './ui/services/global-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('ng-server-prompt-template-demo');
  inlineImageData = signal('');

  private readonly stateService = inject(GlobalStateService);

  configService = inject(ConfigService);
  service = inject(ServerPromptService);
  remoteConfigService = inject(TemplateConfigService);
  destroyRef$ = inject(DestroyRef);

  isLoading = this.stateService.isLoading;
  isError = this.stateService.isError;
  errorMsg = this.stateService.errorMsg;

  constructor() {
    try {
      this.isLoading.set(true);
      this.isError.set(false);
      this.errorMsg.set('');
      const remoteConfig = this.configService.remoteConfig;
      const unsubscribe = setupRemoteConfigListener(remoteConfig, this.remoteConfigService);
      this.destroyRef$.onDestroy(() => {
        unsubscribe();
        console.log('Remote config listener unsubscribed successfully.');
      });
    } catch (e) {
      const errMsg =
        e instanceof Error ? e.message : 'Error occurs while setting up remote config listener';
      this.isError.set(true);
      this.errorMsg.set(errMsg);
      console.error(errMsg);
    } finally {
      this.isLoading.set(false);
    }
  }

  async generateImage() {
    try {
      const templateId = this.remoteConfigService.getTemplateValue('countryTemplateId');
      if (templateId) {
        const inlineData = await this.service.generateContent(templateId, {
          country: 'China',
        });
        this.inlineImageData.set(inlineData);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
