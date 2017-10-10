import { Routes, RouterModule }  from '@angular/router';
import { DashboardComponent } 
  from '../components/index';
import { AuthGuard, CategoriesResolver, TagsResolver } from '../core/services';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'my',
    loadChildren: 'app/user/user.module#UserModule',
    canActivate: [AuthGuard],
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  /*{
    path: 'my-questions',
    loadChildren: 'app/myQuestions/my-questions.module#MyQuestionsModule',
    canActivate: [AuthGuard]
  },*/
  {
    path: 'game-play',
    loadChildren: 'app/game-play/game-play.module#GamePlayModule',
    canActivate: [AuthGuard],
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  }
];
