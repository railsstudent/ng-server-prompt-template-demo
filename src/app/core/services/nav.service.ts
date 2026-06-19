import { METADATA_MAPPING } from '@/core/constants/metadata-mapping.const';
import { NAV_ITEMS } from '@/core/constants/nav-items.const';
import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import { TemplateConfigService } from '@/features/ai/services/template-config.service';
import { TemplateKey } from '@/features/ai/types/template-key.type';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import { createBreadcrumb } from '@/shared/utils/create-breadcrumb';
import { computed, inject, Injectable, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Event, EventType, NavigationEnd, Router } from '@angular/router';
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

  templateKeyAfterRouteChange = linkedSignal<NavigationEnd | undefined, TemplateKey | undefined>({
    source: this.navigationEnd$,
    computation: () => this.getCurrenteRouteTemplateKeyId(),
  });

  templateId = computed(() => {
    const activeKey = this.templateKeyAfterRouteChange();
    const templates = this.templateConfigService.templates();
    return activeKey ? templates[activeKey] : '';
  });

  private getCurrenteRouteTemplateKeyId() {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const data = route.snapshot.data['pageTitleTemplateKeyId'] || undefined;
    if (data) {
      const pageTitleTemplateKeyId = data as PageTitleTemplateKeyId;
      if (pageTitleTemplateKeyId.templateKeyId) {
        return pageTitleTemplateKeyId.templateKeyId;
      }
    }
    return undefined;
  }

  private findMetadataByPath(path: string): Record<string, FormFieldMetadata> {
    const item = METADATA_MAPPING.find((item) => item.path === path);
    return item?.metadata || {};
  }

  private findNavItemByPath(url: string) {
    const item = this.navItems.find((item) => item.path === url);
    return item;
  }

  getRouteData(url: string) {
    const item = this.findNavItemByPath(url);
    const metadata = this.findMetadataByPath(url);

    return {
      title: !item ? 'Edit An Image' : item.title,
      pageTitle: item?.pageTitle || 'Edit An Image',
      templateKeyId: item?.templateKeyId,
      metadata,
    };
  }
}
