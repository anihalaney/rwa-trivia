import { UserActions } from './user.actions';
import { CategoryActions } from './category.actions';
import { TagActions } from './tag.actions';
import { UIStateActions } from './ui-state.actions';

import { ActionWithPayload } from './action-with-payload';


export {
    ActionWithPayload,
    UserActions,
    CategoryActions,
    TagActions,
    UIStateActions
};

export default [
    UserActions,
    CategoryActions,
    TagActions,
    UIStateActions
];
