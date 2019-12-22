import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';
import {
    ProfileSettingsComponent,
    QuestionAddUpdateComponent,
    MyQuestionsComponent,
    InviteFriendsComponent,
    GameProfileComponent
} from '../components';
import { InviteFriendsDialogComponent } from '../components/invite-friends/invite-friends-dialog/invite-friends-dialog.component';
import { ChangePasswordComponent } from 'shared-library/shared/mobile/component';

export const userRoutes: Routes = [
    {
        path: 'profile/:userid',
        component: ProfileSettingsComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'game-profile/:userid',
        component: GameProfileComponent
    },
    {
        path: 'my',
        children: [
            {
                path: 'profile/change-password',
                component: ChangePasswordComponent,
                canActivate: [AuthGuard],
            },
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
                path: 'invite-friends',
                component: InviteFriendsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'questions/add',
                component: QuestionAddUpdateComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'app-invite-friends-dialog',
                component: InviteFriendsDialogComponent,
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
