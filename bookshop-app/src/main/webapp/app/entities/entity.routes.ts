import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'bookshopApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'to-do-item',
    data: { pageTitle: 'bookshopApp.toDoItem.home.title' },
    loadChildren: () => import('./to-do-item/to-do-item.routes'),
  },
  {
    path: 'owner',
    data: { pageTitle: 'bookshopApp.owner.home.title' },
    loadChildren: () => import('./owner/owner.routes'),
  },
  {
    path: 'project',
    data: { pageTitle: 'bookshopApp.project.home.title' },
    loadChildren: () => import('./project/project.routes'),
  },
  {
    path: 'context',
    data: { pageTitle: 'bookshopApp.context.home.title' },
    loadChildren: () => import('./context/context.routes'),
  },
  {
    path: 'priority',
    data: { pageTitle: 'bookshopApp.priority.home.title' },
    loadChildren: () => import('./priority/priority.routes'),
  },
  {
    path: 'status',
    data: { pageTitle: 'bookshopApp.status.home.title' },
    loadChildren: () => import('./status/status.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
