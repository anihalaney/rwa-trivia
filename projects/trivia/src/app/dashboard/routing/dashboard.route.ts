import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './../component/dashboard/dashboard.component';

export const dashboardRoutes: Routes = [
      {
        path: '',
        component: DashboardComponent,
        // canActivate: [AuthGuard]
      },
];
