import { Route } from '@angular/router';
import { clientFeatureDashboardRoutes } from '@fst/client/feature-dashboard';
import { clientFeatureLoginRoutes } from '@fst/client/feature-login';
import { clientFeatureRegisterRoutes } from '@fst/client/feature-register';

export const appRoutes: Route[] = [
  ...clientFeatureDashboardRoutes,
  ...clientFeatureLoginRoutes,
  ...clientFeatureRegisterRoutes,
];
