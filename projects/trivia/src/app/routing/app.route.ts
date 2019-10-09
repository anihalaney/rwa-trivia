import { Routes } from '@angular/router';
import { PrivacyPolicyComponent, InvitationRedirectionComponent } from '../components/index';
import { AuthGuard, BulkLoadGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-and-conditions',
    component: PrivacyPolicyComponent
  },
  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then(m => m.UserModule),
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  {
    path: 'game-play',
    loadChildren: () => import('../game-play/game-play.module').then(m => m.GamePlayModule),
    canActivate: [AuthGuard],
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  {
    path: 'bulk',
    loadChildren: () => import('../bulk/bulk.module').then(m => m.BulkModule),
    canActivate: [AuthGuard],
    canLoad: [BulkLoadGuard]
  },
  {
    path: 'invitation-redirection/:token',
    component: InvitationRedirectionComponent
  }
];
