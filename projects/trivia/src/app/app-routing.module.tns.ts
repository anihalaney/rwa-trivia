import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { LoginComponent } from './mobile/components/login/login.component';
import { LeaderBoardComponent } from './mobile/components/leaderboard/leaderboard.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeaderboardComponent } from './stats/components';
export const routes: Routes = [

    { path: "", redirectTo: "dashboard", pathMatch: "full" },
    {
        path: "dashboard",
        component: DashboardComponent
    },
    // {
    //     path: "dashboard",
    //     loadChildren: "./mobile/components/dashboard/dashboard.module#DashboardModule"
    // },
    {
        path: "leaderboard",
        component: LeaderBoardComponent
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    // {
    //     path: '',
    //     redirectTo: '/login',
    //     pathMatch: 'full',
    // },
    // {
    //     path: 'home',
    //     component: HomeComponent,
    // },

];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
