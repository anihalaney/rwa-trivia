import { Routes } from '@angular/router';
import { PrivacyPolicyComponent, InvitationRedirectionComponent, TermsConditionsComponent } from '../components/index';
import { AuthGuard, BulkLoadGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: '../dashboard/dashboard.module#DashboardModule',
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-and-conditions',
    component: TermsConditionsComponent
  },
  {
    path: 'my',
    loadChildren: '../user/user.module#UserModule',
    canActivate: [AuthGuard],
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  {
    path: 'game-play',
    loadChildren: '../game-play/game-play.module#GamePlayModule',
    canActivate: [AuthGuard],
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  {
    path: 'bulk',
    loadChildren: '../bulk/bulk.module#BulkModule',
    canActivate: [AuthGuard],
    canLoad: [BulkLoadGuard]
  },
  {
    path: 'invitation-redirection/:token',
    component: InvitationRedirectionComponent
  }
];
