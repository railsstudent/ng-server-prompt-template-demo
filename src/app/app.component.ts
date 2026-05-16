import { ConfigService } from '@/features/ai/services/config.service';
import { TemplateConfigService } from '@/features/ai/services/template-config.service';
import { GlobalStateService } from '@/shared/services/global-state.service';
import { FooterComponent } from '@/shared/ui/layout/footer/footer.component';
import { HeaderComponent } from '@/shared/ui/layout/header/header.component';
import { SideNavComponent } from '@/shared/ui/layout/side-nav/side-nav.component';
import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Event, EventType, Router, RouterOutlet } from '@angular/router';
import { createBreadcrumb } from './shared/utils/create-breadcrumb';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, SideNavComponent, HeaderComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  configService = inject(ConfigService);
  templateConfigService = inject(TemplateConfigService);
  stateService = inject(GlobalStateService);
  route = inject(Router);

  status = this.stateService.status;

  routeEvents = toSignal(this.route.events);
  breadcrumb = linkedSignal<Event | undefined, string>({
    source: () => this.routeEvents(),
    computation: (event) =>
      event?.type === EventType.NavigationEnd ? createBreadcrumb(event.url) : '',
  });

  constructor() {
    try {
      const remoteConfig = this.configService.remoteConfig;
      this.templateConfigService.setupRemoteConfigListener(remoteConfig);
    } catch (e) {
      const errMsg =
        e instanceof Error ? e.message : 'Error occurs while setting up remote config listener';
      console.error(errMsg);
    }
  }
}
