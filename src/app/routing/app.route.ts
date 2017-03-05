import { Routes, RouterModule }  from '@angular/router';
import { DashboardComponent, 
         QuestionAddUpdateComponent, MyQuestionsComponent } 
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
    path: 'questions',
    component: MyQuestionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'question/add',
    component: QuestionAddUpdateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  }
];
