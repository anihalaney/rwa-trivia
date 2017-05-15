import { Routes, RouterModule }  from '@angular/router';
import { NewGameComponent, GameComponent } 
  from '../components';
import { AuthGuard } from '../../core/services';

export const gamePlayRoutes: Routes = [
  {
    path: '',
    component: NewGameComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'game/:id',
    component: GameComponent,
    canActivate: [AuthGuard]
  }
];
