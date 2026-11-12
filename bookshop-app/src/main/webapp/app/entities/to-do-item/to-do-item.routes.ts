import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import ToDoItemResolve from './route/to-do-item-routing-resolve.service';

const toDoItemRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/to-do-item.component').then(m => m.ToDoItemComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/to-do-item-detail.component').then(m => m.ToDoItemDetailComponent),
    resolve: {
      toDoItem: ToDoItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/to-do-item-update.component').then(m => m.ToDoItemUpdateComponent),
    resolve: {
      toDoItem: ToDoItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/to-do-item-update.component').then(m => m.ToDoItemUpdateComponent),
    resolve: {
      toDoItem: ToDoItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default toDoItemRoute;
