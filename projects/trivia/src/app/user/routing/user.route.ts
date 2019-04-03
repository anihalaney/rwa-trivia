import { Routes, RouterModule } from '@angular/router';
import {
  ProfileSettingsComponent,
  MyQuestionsComponent,
  QuestionAddUpdateComponent,
  InviteFriendsComponent
} from '../components';
import { AuthGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';

export const userRoutes: Routes = [
  {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full'
  },
  {
    path: 'my/profile/:userid',
    component: ProfileSettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my/profile/:userid',
    component: ProfileSettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my/questions',
    component: MyQuestionsComponent,
    canActivate: [AuthGuard],
    resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
  },
  {
    path: 'my/questions/add',
    component: QuestionAddUpdateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my/invite-friends',
    component: InviteFriendsComponent,
    canActivate: [AuthGuard]
  },
];
