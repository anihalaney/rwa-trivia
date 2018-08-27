import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../components/index';

import {
  AuthGuard, AdminLoadGuard,
  CategoriesResolver, TagsResolver
} from '../../../../shared-library/src/lib/core/route-guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'admin',
    loadChildren: '../admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
    canLoad: [AdminLoadGuard]
  }
];
