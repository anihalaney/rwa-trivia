import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../components/index';
import { InvitationRedirectionComponent } from '../components/index';
import {
  AuthGuard, AdminLoadGuard, BulkLoadGuard,
  CategoriesResolver, TagsResolver
} from '../core/route-guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'my',
    loadChildren: 'app/user/user.module#UserModule',
    canActivate: [AuthGuard],
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  {
    path: 'game-play',
    loadChildren: 'app/game-play/game-play.module#GamePlayModule',
    canActivate: [AuthGuard],
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
    canLoad: [AdminLoadGuard]
  },
  {
    path: 'bulk',
    loadChildren: 'app/bulk/bulk.module#BulkModule',
    canActivate: [AuthGuard],
    canLoad: [BulkLoadGuard]
  },
  {
    path: 'invitation-redirection/:token',
    component: InvitationRedirectionComponent
  }
];
