import { SERVER_TEMPLATE_MODEL } from './ai/constants/server-template-model.token';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServerTemplateService } from './ai/services/server-template.service';
import { RemoteConfigService } from './ai/services/remoteConfig.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = signal('ng-server-prompt-template-demo');
  model = inject(SERVER_TEMPLATE_MODEL);
  inlineImageData = signal('');

  service = inject(ServerTemplateService);
  remoteConfigService = inject(RemoteConfigService);

  async generateImage() {
    try {
      const inlineData = await this.service.generateContent(
        this.remoteConfigService.historicEventTemplateId(),
        {
          event: '2008 Beijing Olympic',
          description: 'Li Ning ran around the bird nest stadium',
        },
      );
      this.inlineImageData.set(inlineData);
    } catch (e) {
      console.error(e);
    }
  }
}
