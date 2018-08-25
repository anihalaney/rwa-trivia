import { Routes, RouterModule } from '@angular/router';
import { BulkDetailsComponent, BulkSummaryComponent, BulkSummaryQuestionComponent, BulkUploadComponent } from '../components/index';

import { AuthGuard } from '../../../../../shared-library/src/lib/core/route-guards';

export const bulkRoutes: Routes = [
  {
    path: '',
    component: BulkSummaryComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'detail/:bulkid',
    component: BulkSummaryQuestionComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'upload',
    component: BulkUploadComponent,
    canActivate: [AuthGuard]
  }
];
