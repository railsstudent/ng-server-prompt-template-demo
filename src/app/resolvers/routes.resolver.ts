import { FormFieldMetadata } from '@/core/form-generator/types/form-field-metadata.type';
import { NavService } from '@/core/services/nav.service';
import { PageTitleTemplateKeyId } from '@/shared/types/page-title-template-keyid.type';
import { inject } from '@angular/core';
import { ResolveFn, RouterStateSnapshot } from '@angular/router';

export const editeRouteTitleResolver: ResolveFn<string> = (_, state: RouterStateSnapshot) => {
  return inject(NavService).getRouteData(state.url).title;
};

export const editePageTitleTemplateKeyIdResolver: ResolveFn<PageTitleTemplateKeyId> = (
  _,
  state: RouterStateSnapshot,
) => {
  const data = inject(NavService).getRouteData(state.url);
  const { pageTitle, templateKeyId } = data;
  return {
    pageTitle,
    templateKeyId,
  };
};

export const metadataResolver: ResolveFn<Record<string, FormFieldMetadata>> = (
  _,
  state: RouterStateSnapshot,
) => {
  return inject(NavService).getRouteData(state.url).metadata;
};
