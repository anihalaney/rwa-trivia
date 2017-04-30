import {Utils} from './utils';
import {AuthenticationService} from './authentication.service';
import {AuthGuard} from './auth-guard';
import {CategoryService} from './category.service';
import {TagService} from './tag.service';
import {QuestionService} from './question.service';
import {GameService} from './game.service';

export {
    Utils,
    AuthenticationService,
    AuthGuard,
    CategoryService,
    TagService,
    QuestionService,
    GameService
};

export default [
    Utils,
    AuthenticationService,
    AuthGuard,
    CategoryService,
    TagService,
    QuestionService,
    GameService
];