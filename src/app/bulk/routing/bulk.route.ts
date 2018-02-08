import { Routes, RouterModule } from '@angular/router';
import { BulkDetailsComponent, BulkUploadComponent,BulkSummaryComponent } from '../components/index';
import { BulkSummaryQuestionListComponent } from '../../shared/components/index';
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
