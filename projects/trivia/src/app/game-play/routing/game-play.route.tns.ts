import { Routes, RouterModule } from '@angular/router';
import { NewGameComponent } from '../components';
import { AuthGuard , CategoriesResolver, TagsResolver} from 'shared-library/core/route-guards';

export const gamePlayRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: NewGameComponent,
    canActivate: [AuthGuard],
    resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
  }
];
