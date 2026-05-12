import { NavService } from '@/core/services/nav.service';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import { inject } from '@angular/core';
import { ResolveFn, RouterStateSnapshot } from '@angular/router';

function findNavItemByPath(url: string) {
  const navService = inject(NavService);
  const item = navService.navItems.find((item) => item.path === url);

  return item;
}

export const editeRouteTitleResolver: ResolveFn<string> = (_, state: RouterStateSnapshot) => {
  const item = findNavItemByPath(state.url);
  return !item ? 'Edit An Image' : item.title;
};

export const editePageTitleTemplateKeyIdResolver: ResolveFn<PageTitleTemplateKeyId> = (
  _,
  state: RouterStateSnapshot,
) => {
  const item = findNavItemByPath(state.url);
  return {
    pageTitle: item?.pageTitle || 'Edit An Image',
    templateKeyId: item?.templateKeyId,
  };
};
