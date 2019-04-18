import { Routes } from '@angular/router';
import { AuthGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';
import { RecentGamesComponent } from './../components/recent-games/recent-games.component';
import { PrivacyPolicyComponent } from './../components/privacy-policy/privacy-policy.component';
import { AchievementsComponent } from '../components';

export const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadChildren: './../dashboard/dashboard.module#DashboardModule',
    },
    {
        path: 'game-play',
        loadChildren: './../game-play/game-play.module#GamePlayModule',
        canActivate: [AuthGuard],
        resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
    },
    {
        path: 'user',
        loadChildren: './../user/user.module#UserModule',
        resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
    },
    {
        path: 'recent-game',
        component: RecentGamesComponent,
        canActivate: [AuthGuard]
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
        path: 'achievements',
        component: AchievementsComponent,
        canActivate: [AuthGuard]
    },
];
