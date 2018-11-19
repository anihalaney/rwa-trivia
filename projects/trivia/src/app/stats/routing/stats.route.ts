import { Routes } from '@angular/router';
import { LeaderboardComponent } from './../components/leaderboard/leaderboard.component';

export const statsRoutes: Routes = [
  {
    path: 'stats/leaderboard/:category',
    component: LeaderboardComponent,

  }
];
