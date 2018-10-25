import { Routes, RouterModule } from '@angular/router';
import { BulkSummaryQuestionComponent } from '../components/index';

import { AuthGuard } from 'shared-library/core/route-guards';

export const bulkRoutes: Routes = [
  {
    path: 'detail/:bulkid',
    component: BulkSummaryQuestionComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  }
];
