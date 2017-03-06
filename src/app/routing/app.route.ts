import { Routes, RouterModule }  from '@angular/router';
import { DashboardComponent } 
  from '../components/index';
import { AuthGuard } from '../core/services';

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
    path: 'my-questions',
    loadChildren: 'app/myQuestions/my-questions.module#MyQuestionsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  }
];
