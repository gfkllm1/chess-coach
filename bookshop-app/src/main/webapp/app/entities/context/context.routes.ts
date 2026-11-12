import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import ContextResolve from './route/context-routing-resolve.service';

const contextRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/context.component').then(m => m.ContextComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/context-detail.component').then(m => m.ContextDetailComponent),
    resolve: {
      context: ContextResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/context-update.component').then(m => m.ContextUpdateComponent),
    resolve: {
      context: ContextResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/context-update.component').then(m => m.ContextUpdateComponent),
    resolve: {
      context: ContextResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default contextRoute;
