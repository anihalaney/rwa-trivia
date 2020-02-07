import {UserActions} from './user.actions';
import {CategoryActions} from './category.actions';
import {ApplicationSettingsActions} from './application-settings.actions';
import {TagActions} from './tag.actions';
import {QuestionActions} from './question.actions';
import {UIStateActions} from './ui-state.actions';
import {GameActions} from './game.actions';
import {ActionWithPayload} from './action-with-payload';
import { TopicActions } from './topic.actions';


export {
    ActionWithPayload,
    UserActions,
    CategoryActions,
    ApplicationSettingsActions,
    TagActions,
    QuestionActions,
    UIStateActions,
    GameActions,
    TopicActions
};

export default [
    UserActions,
    CategoryActions,
    ApplicationSettingsActions,
    TagActions,
    QuestionActions,
    UIStateActions,
    GameActions,
    TopicActions
];
