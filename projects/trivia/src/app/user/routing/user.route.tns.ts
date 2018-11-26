import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';
import {
    ProfileSettingsComponent,
    QuestionAddUpdateComponent,
    MyQuestionsComponent
} from '../components';

export const userRoutes: Routes = [
    {
        path: 'profile/:userid',
        component: ProfileSettingsComponent,
        canActivate: [AuthGuard]
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
    }
];
