import { Routes, RouterModule }  from '@angular/router';
import { NewGameComponent, GameComponent } 
  from '../components';
import { AuthGuard, CategoriesResolver, TagsResolver } from '../../core/services';

export const gamePlayRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: NewGameComponent,
    canActivate: [AuthGuard],
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  {
    path: ':id',
    component: GameComponent,
    canActivate: [AuthGuard],
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  }
];
