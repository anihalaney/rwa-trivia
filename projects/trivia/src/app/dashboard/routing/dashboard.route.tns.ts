import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './../component/dashboard/dashboard.component';
import { LeaderboardComponent } from './../component/leaderboard/leaderboard.component';

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        // canActivate: [AuthGuard]
      },

      {
        path: 'leaderboard/:category',
        component: LeaderboardComponent,
      }
];
