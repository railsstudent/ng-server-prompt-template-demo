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
  // {
  //   path: 'edit-images/:path',
  //   redirectTo: () => import('/edit-images/edit-images.component'),
  //   title: 'Edit Images', // to be handled by resoler
  //   data: {
  //     templateKey: 'glassBottleSouvenirTemplateId'  // to be handled by resoler
  //   }
  // },
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
