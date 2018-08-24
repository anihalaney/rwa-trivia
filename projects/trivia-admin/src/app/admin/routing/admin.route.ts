import { Routes, RouterModule } from '@angular/router';
import {
  DashboardComponent, CategoriesComponent, TagsComponent,
  AdminQuestionsComponent, AdminComponent, BulkComponent
} from '../components/index';
import { BulkSummaryQuestionComponent } from '../../bulk/components';
import { AuthGuard } from '../../../../../shared-library/src/lib/core/route-guards';

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
      },
      {
        path: 'questions/bulk-questions',
        component: AdminQuestionsComponent
      },
      {
        path: 'bulk',
        component: BulkComponent
      },
      {
        path: 'bulk/detail/:bulkid',
        component: BulkSummaryQuestionComponent
      }
    ]
  }
];
