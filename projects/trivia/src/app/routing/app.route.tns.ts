import { Routes } from '@angular/router';
import { AuthGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';
import { RecentGamesComponent } from './../components/recent-games/recent-games.component';

export const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadChildren: '../dashboard/dashboard.module#DashboardModule',
    },
    {
        path: 'game-play',
        loadChildren: './../game-play/game-play.module#GamePlayModule',
        canActivate: [AuthGuard],
        resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
    },
    {
        path: 'my',
        loadChildren: './../user/user.module#UserModule',
        canActivate: [AuthGuard],
        resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
    },
    {
        path: 'recent-game',
        component: RecentGamesComponent,
        canActivate: [AuthGuard]
    },

];
