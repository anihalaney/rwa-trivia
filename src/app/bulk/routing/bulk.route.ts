import { Routes, RouterModule } from '@angular/router';
import { BulkDetailsComponent, BulkUploadComponent,BulkSummaryComponent } from '../components/index';

import { AuthGuard } from '../../core/services';

export const bulkRoutes: Routes = [
  {
    path: '',
    component: BulkSummaryComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'upload',
    component: BulkUploadComponent,
    canActivate: [AuthGuard]
  }
];
