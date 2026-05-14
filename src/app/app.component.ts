import { ConfigService } from '@/features/ai/services/config.service';
import { TemplateConfigService } from '@/features/ai/services/template-config.service';
import { GlobalStateService } from '@/shared/services/global-state.service';
import { FooterComponent } from '@/shared/ui/layout/footer/footer.component';
import { HeaderComponent } from '@/shared/ui/layout/header/header.component';
import { SideNavComponent } from '@/shared/ui/layout/side-nav/side-nav.component';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventType, Router, RouterOutlet } from '@angular/router';
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

  // breadcrumb = computed(() => createBreadcrumb(this.route.url));
  breadcrumb = signal('');

  constructor() {
    try {
      const remoteConfig = this.configService.remoteConfig;
      this.templateConfigService.setupRemoteConfigListener(remoteConfig);

      this.route.events.pipe(takeUntilDestroyed()).subscribe((event) => {
        if (event.type === EventType.NavigationEnd) {
          console.log(event.url);
          this.breadcrumb.set(createBreadcrumb(event.url));
        }
      });
    } catch (e) {
      const errMsg =
        e instanceof Error ? e.message : 'Error occurs while setting up remote config listener';
      console.error(errMsg);
    }
  }
}
