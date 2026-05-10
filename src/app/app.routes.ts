import { Routes } from '@angular/router';
import {
  editePageTitleResolver,
  editeRouteTitleResolver,
  getTemplateKeyIdResolver,
} from './routes.resolver';

export const routes: Routes = [
  {
    path: 'error',
    loadComponent: () => import('./ui/error/error.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'edit-image/:path',
    loadComponent: () => import('./edit-image/edit-image.component'),
    title: editeRouteTitleResolver,
    resolve: {
      pageTitle: editePageTitleResolver,
      templateKey: getTemplateKeyIdResolver,
    },
  },
  // {
  //   path: 'country-form',
  //   loadComponent: () => import('/country-form/country-form.component'),
  // },
  // {
  //   path: 'historic-event-form',
  //   loadComponent: () => import('/historic-event-form/historic-event-form.component'),
  // },
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
