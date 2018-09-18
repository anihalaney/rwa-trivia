import { Routes, RouterModule } from '@angular/router';
import { NewGameComponent, GameComponent } from '../components';
import { AuthGuard, CategoriesResolver, TagsResolver } from '../../../../../shared-library/src/lib/core/route-guards';

export const gamePlayRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: NewGameComponent,
    canActivate: [AuthGuard],
    resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
  },
  {
    path: ':gameid',
    component: GameComponent,
    canActivate: [AuthGuard],
    resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
  }
];
