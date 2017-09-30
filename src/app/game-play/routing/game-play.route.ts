import { Routes, RouterModule }  from '@angular/router';
import { NewGameComponent, GameComponent } 
  from '../components';
import { AuthGuard, CategoriesResolver, TagsResolver } from '../../core/services';

export const gamePlayRoutes: Routes = [
  {
    path: '',
    component: NewGameComponent,
    canActivate: [AuthGuard],   
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  {
    path: 'game/:id',
    component: GameComponent,
    canActivate: [AuthGuard]
  }
];
