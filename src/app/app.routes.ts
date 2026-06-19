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

const componentLoaderMap: Record<string, LoadComponentReturnType> = buildComponentLoaderMap();

function createResolverRoute(path: string, componentName: string) {
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

function buildComponentLoaderMap() {
  const componentKeys = ['country-form', 'historic-event-form', 'city-form'];
  const formGeneratorLoaderMap = componentKeys.reduce(
    (acc, key) => {
      acc[key] = () => import('./shared/ui/form-generator/form-generator.component');
      return acc;
    },
    {} as Record<string, LoadComponentReturnType>,
  );

  const componentLoaderMap: Record<string, LoadComponentReturnType> = {
    'edit-image': () => import('./features/edit-image/edit-image.component'),
    ...formGeneratorLoaderMap,
  };
  return componentLoaderMap;
}

const genImageRoutes = [
  createResolverRoute('edit-image/:path', 'edit-image'),
  createResolverRoute('country-form', 'country-form'),
  createResolverRoute('historic-event-form', 'historic-event-form'),
  createResolverRoute('city-form', 'city-form'),
];

export const routes: Routes = [
  {
    path: 'error',
    loadComponent: () => import('./shared/ui/error/error.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component'),
  },
  ...genImageRoutes,
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
