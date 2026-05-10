import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from './ai/services/config.service';
import { TemplateConfigService } from './ai/services/template-config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  configService = inject(ConfigService);
  remoteConfigService = inject(TemplateConfigService);

  constructor() {
    try {
      const remoteConfig = this.configService.remoteConfig;
      this.remoteConfigService.setupRemoteConfigListener(remoteConfig);
    } catch (e) {
      const errMsg =
        e instanceof Error ? e.message : 'Error occurs while setting up remote config listener';
      console.error(errMsg);
    }
  }
}
