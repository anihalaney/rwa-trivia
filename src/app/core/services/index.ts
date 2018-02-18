import {Utils} from './utils';
import {AuthenticationService} from './authentication.service';
import {AuthInterceptor} from './auth-interceptor';
import {CategoryService} from './category.service';
import {TagService} from './tag.service';
import {QuestionService} from './question.service';
import {UserService} from './user.service';
import {GameService} from './game.service';

import {AuthGuard} from './auth-guard';
import {AdminLoadGuard, BulkLoadGuard} from './load-guard';
import {CategoriesResolver} from './route-guards/categories-resolver';
import {TagsResolver} from './route-guards/tags-resolver';
import { BulkService } from './bulk.service';

export {
    Utils,
    AuthenticationService,
    AuthInterceptor,
    CategoryService,
    TagService,
    QuestionService,
    GameService,
    AuthGuard,
    AdminLoadGuard,
    BulkLoadGuard,
    CategoriesResolver,
    TagsResolver,
    UserService,
    BulkService
};

export default [
    Utils,
    AuthenticationService,
    AuthInterceptor,
    CategoryService,
    TagService,
    QuestionService,
    GameService,
    AuthGuard,
    AdminLoadGuard,
    BulkLoadGuard,
    CategoriesResolver,
    TagsResolver,
    UserService,
    BulkService
];
