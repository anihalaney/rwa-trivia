import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';
import {
    ProfileSettingsComponent
} from '../components';

export const userRoutes: Routes = [
    {
        path: 'profile/:userid',
        component: ProfileSettingsComponent,
        canActivate: [AuthGuard]
    }
];
