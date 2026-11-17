import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'avatar',
    loadComponent: () => import('./pages/avatar/avatar.page').then((m) => m.AvatarPage),
  },
  {
    path: 'aboutus',
    loadComponent: () => import('./pages/aboutus/aboutus.page').then((m) => m.AboutusPage),
  },
];
