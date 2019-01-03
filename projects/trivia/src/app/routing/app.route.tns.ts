import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { AuthGuard, CategoriesResolver, TagsResolver } from '../../../../shared-library/src/lib/core/route-guards';

export const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent
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

];
