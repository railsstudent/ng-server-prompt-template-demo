import { ConfigService } from '@/features/ai/services/config.service';
import { TemplateConfigService } from '@/features/ai/services/template-config.service';
import { GlobalStateService } from '@/shared/services/global-state.service';
import { FooterComponent } from '@/shared/ui/layout/footer/footer.component';
import { HeaderComponent } from '@/shared/ui/layout/header/header.component';
import { SideNavComponent } from '@/shared/ui/layout/side-nav/side-nav.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, SideNavComponent, HeaderComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  configService = inject(ConfigService);
  remoteConfigService = inject(TemplateConfigService);
  stateService = inject(GlobalStateService);

  status = this.stateService.status;

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
