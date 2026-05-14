import { Routes } from '@angular/router';
import {
  editePageTitleTemplateKeyIdResolver,
  editeRouteTitleResolver,
} from './resolvers/routes.resolver';

export const routes: Routes = [
  {
    path: 'error',
    loadComponent: () => import('./shared/ui/error/error.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component'),
  },
  {
    path: 'edit-image/:path',
    loadComponent: () => import('./features/edit-image/edit-image.component'),
    title: editeRouteTitleResolver,
    resolve: {
      pageTitleTemplateKeyId: editePageTitleTemplateKeyIdResolver,
    },
  },
  {
    path: 'country-form',
    loadComponent: () => import('./features/country-form/country-form.component'),
    title: editeRouteTitleResolver,
    resolve: {
      pageTitleTemplateKeyId: editePageTitleTemplateKeyIdResolver,
    },
  },
  {
    path: 'historic-event-form',
    loadComponent: () => import('./features/historic-event-form/historic-event-form.component'),
    title: editeRouteTitleResolver,
    resolve: {
      pageTitleTemplateKeyId: editePageTitleTemplateKeyIdResolver,
    },
  },
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
