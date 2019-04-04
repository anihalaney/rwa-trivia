import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';
import {
    ProfileSettingsComponent,
    QuestionAddUpdateComponent,
    MyQuestionsComponent,
    InviteFriendsComponent,
    UserProfileComponent
} from '../components';
import { InviteFriendsDialogComponent } from '../components/invite-friends/invite-friends-dialog/invite-friends-dialog.component';

export const userRoutes: Routes = [
    {
        path: 'profile/:userid',
        component: UserProfileComponent,
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
        path: 'my/invite-friends',
        component: InviteFriendsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'my/questions/add',
        component: QuestionAddUpdateComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'my/app-invite-friends-dialog',
        component: InviteFriendsDialogComponent,
        canActivate: [AuthGuard]
    },
];
