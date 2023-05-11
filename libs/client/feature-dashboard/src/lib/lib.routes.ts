import { Route } from '@angular/router';
import { FeatureDashboardComponent } from './feature-dashboard/feature-dashboard.component';

export const clientFeatureDashboardRoutes: Route[] = [
  {
    path: '',
    component: FeatureDashboardComponent,
    canActivate: [
      // authGuard
    ],
  },
];
