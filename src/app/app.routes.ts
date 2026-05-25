import { Type } from '@angular/core';
import { DefaultExport, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import {
  editePageTitleTemplateKeyIdResolver,
  editeRouteTitleResolver,
  metadataResolver,
} from './resolvers/routes.resolver';

type LoadComponentReturnType = () =>
  | Type<unknown>
  | Observable<Type<unknown> | DefaultExport<Type<unknown>>>
  | Promise<Type<unknown> | DefaultExport<Type<unknown>>>;

function createResolverRoute(path: string, componentName: string) {
  const componentLoaderMap: Record<string, LoadComponentReturnType> = {
    'edit-image': () => import('./features/edit-image/edit-image.component'),
    'country-form': () => import('./features/country-form/country-form.component'),
    'historic-event-form': () =>
      import('./features/historic-event-form/historic-event-form.component'),
  };

  const loadComponent = componentLoaderMap[componentName];

  if (!loadComponent) {
    return {
      path,
      redirectTo: 'error',
    };
  }

  return {
    path,
    loadComponent,
    title: editeRouteTitleResolver,
    resolve: {
      pageTitleTemplateKeyId: editePageTitleTemplateKeyIdResolver,
      metadata: metadataResolver,
    },
  };
}

export const routes: Routes = [
  {
    path: 'error',
    loadComponent: () => import('./shared/ui/error/error.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component'),
  },
  createResolverRoute('edit-image/:path', 'edit-image'),
  createResolverRoute('country-form', 'country-form'),
  createResolverRoute('historic-event-form', 'historic-event-form'),
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
