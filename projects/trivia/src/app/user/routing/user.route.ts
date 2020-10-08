import { Routes, RouterModule } from '@angular/router';
import {
  ProfileSettingsComponent,
  MyQuestionsComponent,
  QuestionAddUpdateComponent,
  InviteFriendsComponent,
  GameProfileComponent
} from '../components';
import { AuthGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';

export const userRoutes: Routes = [
  {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full'
  },
  {
    path: 'profile/:userid',
    component: ProfileSettingsComponent
  },
  {
    path: 'game-profile/:userid',
    component: GameProfileComponent
  },
  {
    path: 'my',
    children: [
      {
        path: 'profile/:userid',
        component: ProfileSettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'questions',
        component: MyQuestionsComponent,
        canActivate: [AuthGuard],
        resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
      },
      {
        path: 'questions/add',
        component: QuestionAddUpdateComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'invite-friends',
        component: InviteFriendsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'game-profile/:userid',
        component: GameProfileComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];
