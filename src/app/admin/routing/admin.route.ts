import { Routes, RouterModule }  from '@angular/router';
import { DashboardComponent, CategoriesComponent, TagsComponent, 
         AdminQuestionsComponent, AdminComponent } 
  from '../components/index';
import { AuthGuard } from '../../core/services';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DashboardComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'tags',
        component: TagsComponent
      },
      {
        path: 'questions',
        component: AdminQuestionsComponent
      }

    ]
  }
];
