import { ConfigService } from '@/features/ai/services/config.service';
import { TemplateConfigService } from '@/features/ai/services/template-config.service';
import { GlobalStateService } from '@/shared/services/global-state.service';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import { FooterComponent } from '@/shared/ui/layout/footer/footer.component';
import { HeaderComponent } from '@/shared/ui/layout/header/header.component';
import { SideNavComponent } from '@/shared/ui/layout/side-nav/side-nav.component';
import { createBreadcrumb } from '@/shared/utils/create-breadcrumb';
import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Event, EventType, Router, RouterOutlet } from '@angular/router';
import { filter, shareReplay } from 'rxjs';

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
  activatedRoute = inject(ActivatedRoute);
  status = this.stateService.status;

  navigationEnd$ = toSignal(
    this.route.events.pipe(
      filter((event) => event.type === EventType.NavigationEnd),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    ),
  );

  breadcrumb = linkedSignal<Event | undefined, string>({
    source: () => this.navigationEnd$(),
    computation: (event) =>
      event && event.type == EventType.NavigationEnd ? createBreadcrumb(event.url) : '',
  });

  templateId = linkedSignal({
    source: () => this.navigationEnd$(),
    computation: (event) => {
      if (event && event.type == EventType.NavigationEnd) {
        return this.getCurrentlyUsedTemplateId();
      }
      return '';
    },
  });

  private getCurrentlyUsedTemplateId(): string {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const data = route.snapshot.data['pageTitleTemplateKeyId'] || undefined;
    if (data) {
      const pageTitleTemplateKeyId = data as PageTitleTemplateKeyId;
      if (pageTitleTemplateKeyId.templateKeyId) {
        return this.templateConfigService.getTemplateValue(pageTitleTemplateKeyId.templateKeyId);
      }
    }
    return '';
  }

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
