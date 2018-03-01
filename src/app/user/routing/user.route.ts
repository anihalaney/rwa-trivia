import { Routes, RouterModule } from '@angular/router';
import {
  ProfileSettingsComponent,
  MyQuestionsComponent,
  QuestionAddUpdateComponent
} from '../components';
import { AuthGuard, CategoriesResolver, TagsResolver } from '../../core/services';

export const userRoutes: Routes = [
  {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full'
  },
  {
    path: 'profile/:userid',
    component: ProfileSettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'questions/:userid',
    component: MyQuestionsComponent,
    canActivate: [AuthGuard],
    resolve: { "categories": CategoriesResolver, "tags": TagsResolver }
  },
  {
    path: 'questions/add',
    component: QuestionAddUpdateComponent,
    canActivate: [AuthGuard]
  },
];
