import { Routes, RouterModule }  from '@angular/router';
import { MyQuestionsComponent, QuestionAddUpdateComponent } 
  from '../components/index';
import { AuthGuard } from '../../core/services';

export const myQuestionsRoutes: Routes = [
  {
    path: '',
    component: MyQuestionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: QuestionAddUpdateComponent,
    canActivate: [AuthGuard]
  },
];
