import {UserActions} from './user.actions';
import {CategoryActions} from './category.actions';
import {TagActions} from './tag.actions';
import {QuestionActions} from './question.actions';
import {UIStateActions} from './ui-state.actions';
import {GameActions} from './game.actions';
import {ActionWithPayload} from './action-with-payload';
import {FileSummaryActions} from './file-summary.actions';

export {
    ActionWithPayload,
    UserActions,
    CategoryActions,
    TagActions,
    QuestionActions,
    UIStateActions,
    GameActions,
    FileSummaryActions
};

export default [
    UserActions,
    CategoryActions,
    TagActions,
    QuestionActions,
    UIStateActions,
    GameActions,
    FileSummaryActions
];
