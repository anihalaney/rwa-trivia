import { Routes, RouterModule } from '@angular/router';
import { BulkSummaryComponent, BulkDetailsComponent, BulkUploadComponent, BulkSummaryQuestionListComponent } from '../components/index';
import { AuthGuard } from '../../core/services';

export const bulkRoutes: Routes = [
  {
    path: '',
    component: BulkSummaryComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'details/:id',
    component: BulkSummaryQuestionListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'upload',
    component: BulkUploadComponent,
    canActivate: [AuthGuard]
  }
];
