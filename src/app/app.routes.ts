import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'buscar',
    loadComponent: () =>
      import('./features/weather/city-search/city-search').then(m => m.CitySearch),
  },
  {
    path: 'clima/:cityId',
    loadComponent: () =>
      import('./features/weather/weather-detail/weather-detail').then(m => m.WeatherDetail),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/register/register').then(m => m.Register),
  },
  {
    path: 'mis-ciudades',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/saved-cities/city-list/city-list').then(m => m.CityList),
  },
  {
    path: 'estadisticas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/statistics/statistics').then(m => m.Statistics),
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];
