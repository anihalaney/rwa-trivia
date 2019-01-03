import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { User, Question, Invitation, Game, Friends } from 'shared-library/shared/model';

export enum UserActionTypes {

    LOAD_USER_PUBLISHED_QUESTIONS = '[User] LoadUserPublishedQuestions',
    LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS = '[User] LoadUserPublishedQuestionsSuccess',
    LOAD_USER_UNPUBLISHED_QUESTIONS = '[User] LoadUserUnpublishedQuestions',
    LOAD_USER_UNPUBLISHED_QUESTIONS_SUCCESS = '[User] LoadUserUnpublishedQuestionsSuccess',
    ADD_QUESTION = '[User] AddQuestions',
    ADD_QUESTION_SUCCESS = '[User] AddQuestionsSuccess',
    UPDATE_USER_SUCCESS = '[User] UpdateUserSuccess',
    ADD_USER_INVITATION = '[User] AddUserInvitation',
    GET_GAME_RESULT = '[User] GetGameResult',
    GET_GAME_RESULT_SUCCESS = '[User] GetGameResultSuccess',
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

// Get User's game result
export class GetGameResult implements Action {
    readonly type = UserActionTypes.GET_GAME_RESULT;
    constructor(public payload: User) { }
}

// Get User's game result Success
export class GetGameResultSuccess implements Action {
    readonly type = UserActionTypes.GET_GAME_RESULT_SUCCESS;
    constructor(public payload: Game[]) { }
}


export type UserActions
    = LoadUserPublishedQuestions
    | LoadUserPublishedQuestionsSuccess
    | LoadUserUnpublishedQuestions
    | LoadUserUnpublishedQuestionsSuccess
    | AddQuestion
    | UpdateUserSuccess
    | GetGameResult
    | GetGameResultSuccess;

