import {AuthenticationService} from './authentication.service';
import {AuthGuard} from './auth-guard';
import {CategoryService} from './category.service';
import {TagService} from './tag.service';
import {QuestionService} from './question.service';

export {
    AuthenticationService,
    AuthGuard,
    CategoryService,
    TagService,
    QuestionService
};

export default [
    AuthenticationService,
    AuthGuard,
    CategoryService,
    TagService,
    QuestionService
];