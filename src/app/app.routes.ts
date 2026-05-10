import { Routes } from '@angular/router';

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
    title: 'Edit Images', // to be handled by a resolver
    data: {
      templateKey: 'glassBottleSouvenirTemplateId', // to be handled by a resolver
    },
  },
  // {
  //   path: 'country-form',
  //   loadComponent: () => import('/country-form/country-form.component'),
  // },
  // {
  //   path: 'history-event-form',
  //   loadComponent: () => import('/historic-event-form/history-event-form.component'),
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
