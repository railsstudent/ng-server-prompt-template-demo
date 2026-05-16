import { NAV_ITEMS } from '@/core/constants/nav-items.const';
import { TemplateConfigService } from '@/features/ai/services/template-config.service';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import { createBreadcrumb } from '@/shared/utils/create-breadcrumb';
import { inject, Injectable, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Event, EventType, Router } from '@angular/router';
import { filter, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private readonly templateConfigService = inject(TemplateConfigService);
  private readonly route = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  navItems = NAV_ITEMS;

  private navigationEnd$ = toSignal(
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
  }).asReadonly();

  templateId = linkedSignal({
    source: () => this.navigationEnd$(),
    computation: (event) => {
      if (event && event.type == EventType.NavigationEnd) {
        return this.getCurrentlyUsedTemplateId();
      }
      return '';
    },
  }).asReadonly();

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
}
