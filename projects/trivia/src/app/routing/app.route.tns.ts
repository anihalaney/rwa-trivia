import { Routes } from '@angular/router';
import { AuthGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';
import { PrivacyPolicyComponent } from './../components/privacy-policy/privacy-policy.component';
import { AchievementsComponent } from '../components';
import { UserFeedbackComponent } from 'shared-library/shared/mobile/component/user-feedback/user-feedback.component';
import { SignupExtraInfoComponent } from 'shared-library/shared/components/signup-extra-info/signup-extra-info.component'
import { FirstQuestionComponent } from 'shared-library/shared/mobile/component/first-question/first-question.component';
import { SelectCategoryTagComponent } from 'shared-library/shared/mobile/component/select-category-tag/select-category-tag.component';
import { NotificationComponent } from 'shared-library/shared/mobile/component/notification/notification.component';
import { RecentGamesComponent } from 'shared-library/shared/components/recent-games/recent-games.component';
import { UpdateCategoryTagComponent } from '../../../../shared-library/src/lib/shared/mobile/component';

export const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadChildren: './../dashboard/dashboard.module#DashboardModule',
    },
    {
        path: 'game-play',
        loadChildren: './../game-play/game-play.module#GamePlayModule',
        canActivate: [AuthGuard],
        resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
    },
    {
        path: 'user',
        loadChildren: './../user/user.module#UserModule',
        resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
    },
    {
        path: 'terms-and-conditions',
        component: PrivacyPolicyComponent
    },
    {
        path: 'user-feedback',
        component: UserFeedbackComponent
    },
    {
        path: 'achievements',
        component: AchievementsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'signup-extra-info',
        component: SignupExtraInfoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'first-question',
        component: FirstQuestionComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'select-category-tag',
        component: SelectCategoryTagComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'notification',
        component: NotificationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'recent-games',
        component: RecentGamesComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'update-category-tag',
        component: UpdateCategoryTagComponent,
        canActivate: [AuthGuard]
    }
];
