import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LeaderBoardComponent } from './mobile/components/leaderboard/leaderboard.component';
export const routes: Routes = [

    { path: "", redirectTo: "leaderboard", pathMatch: "full" },
    {
        path: "dashboard",
        loadChildren: "./mobile/components/dashboard/dashboard.module#DashboardModule"
    },
    {
        path:"leaderboard",
        component:LeaderBoardComponent
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
    // {
    //     path: 'login',
    //     component: LoginComponent,
    // },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
