import { Routes } from '@angular/router';
import { OnboardingGuard } from './core/guards/onboarding-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPage)
  },
  {
    path: 'task-detail',
    loadComponent: () => import('./pages/task-detail/task-detail.page').then(m => m.TaskDetailPage)
  },
  {
    // RUTA PADRE DE LAS PESTAÑAS
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [OnboardingGuard], // Protegemos el acceso a toda la app desde aquí
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./pages/calendar/calendar.page').then(m => m.CalendarPage)
      },
      {
        path: 'stats',
        loadComponent: () => import('./pages/stats/stats.page').then(m => m.StatsPage)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];
