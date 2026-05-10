import { inject } from '@angular/core';
import { ResolveFn, RouterStateSnapshot } from '@angular/router';
import { TemplateKey } from './ai/types/template-key.type';
import { NavService } from './services/nav.service';

function findNavItemByPath(url: string) {
  const navService = inject(NavService);
  const item = navService.navItems.find((item) => item.path === url);

  return item;
}

export const editeRouteTitleResolver: ResolveFn<string> = (_, state: RouterStateSnapshot) => {
  const item = findNavItemByPath(state.url);
  return !item ? 'Edit An Image' : item.title;
};

export const editePageTitleResolver: ResolveFn<string> = (_, state: RouterStateSnapshot) => {
  const item = findNavItemByPath(state.url);
  return !item ? 'Edit An Image' : item.pageTitle;
};

export const getTemplateKeyIdResolver: ResolveFn<TemplateKey | undefined> = (
  _,
  state: RouterStateSnapshot,
) => {
  const item = findNavItemByPath(state.url);
  return item ? item.templateKeyId : undefined;
};
