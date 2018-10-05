import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { LoginComponent } from './mobile/components/login/login.component';
import { LeaderBoardContainerComponent } from './stats/components/mobile/leaderboard-container/leaderboard-container.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [

    { path: "", redirectTo: "dashboard", pathMatch: "full" },
    {
        path: "dashboard",
        component: DashboardComponent
    },
    {
        path: "leaderboard",
        component: LeaderBoardContainerComponent
    },
    {
        path: 'login',
        component: LoginComponent,
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
