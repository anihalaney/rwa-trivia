import { NgModule } from '@angular/core';
import { RouterModule  } from '@angular/router';

import { adminRoutes }   from './admin.route';

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ]
})
export class AdminRoutingModule { }
