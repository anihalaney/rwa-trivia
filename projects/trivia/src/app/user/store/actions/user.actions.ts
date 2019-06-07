import { Action } from '@ngrx/store';
import { User, Question } from 'shared-library/shared/model';

export enum UserActionTypes {

    LOAD_USER_PUBLISHED_QUESTIONS = '[User] LoadUserPublishedQuestions',
    LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS = '[User] LoadUserPublishedQuestionsSuccess',
    LOAD_USER_UNPUBLISHED_QUESTIONS = '[User] LoadUserUnpublishedQuestions',
    LOAD_USER_UNPUBLISHED_QUESTIONS_SUCCESS = '[User] LoadUserUnpublishedQuestionsSuccess',
    ADD_QUESTION = '[User] AddQuestions',
    ADD_QUESTION_SUCCESS = '[User] AddQuestionsSuccess',
    UPDATE_USER_SUCCESS = '[User] UpdateUserSuccess',
    CHECK_DISPLAY_NAME = '[User] CheckDisplayName',
    CHECK_DISPLAY_NAME_SUCCESS = '[User] CheckDisplayNameSuccess',
}

// Load User Published Question by userId
export class LoadUserPublishedQuestions implements Action {
    readonly type = UserActionTypes.LOAD_USER_PUBLISHED_QUESTIONS;
    constructor(public payload: { user: User }) { }
}

// Load User Published Question by userId Success
export class LoadUserPublishedQuestionsSuccess implements Action {
    readonly type = UserActionTypes.LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS;
    constructor(public payload: Question[]) { }
}

// Load User Unpublished Question by userId
export class LoadUserUnpublishedQuestions implements Action {
    readonly type = UserActionTypes.LOAD_USER_UNPUBLISHED_QUESTIONS;
    constructor(public payload: { user: User }) { }
}

// Load User Unpublished Question by userId Success
export class LoadUserUnpublishedQuestionsSuccess implements Action {
    readonly type = UserActionTypes.LOAD_USER_UNPUBLISHED_QUESTIONS_SUCCESS;
    constructor(public payload: Question[]) { }
}

// Add Questions
export class AddQuestion implements Action {
    readonly type = UserActionTypes.ADD_QUESTION;
    constructor(public payload: { question: Question }) { }
}

// Load User Profile By Id Success
export class UpdateUserSuccess implements Action {
    readonly type = UserActionTypes.UPDATE_USER_SUCCESS;
    constructor(public payload: User) { }
}

export class CheckDisplayName implements Action {
    readonly type = UserActionTypes.CHECK_DISPLAY_NAME;
    constructor(public payload: string) { } // game
}

export class CheckDisplayNameSuccess implements Action {
    readonly type = UserActionTypes.CHECK_DISPLAY_NAME_SUCCESS;
    constructor(public payload: boolean) { } // game
}


export type UserActions
    = LoadUserPublishedQuestions
    | LoadUserPublishedQuestionsSuccess
    | LoadUserUnpublishedQuestions
    | LoadUserUnpublishedQuestionsSuccess
    | AddQuestion
    | UpdateUserSuccess
    | CheckDisplayName
    | CheckDisplayNameSuccess;
