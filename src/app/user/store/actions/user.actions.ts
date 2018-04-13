import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { User, Question, Invitations } from '../../../model';

export enum UserActionTypes {

    ADD_USER_PROFILE = '[User] AddUserProfile',
    ADD_USER_PROFILE_SUCCESS = '[User] AddUserProfileSuccess',
    LOAD_USER_PUBLISHED_QUESTIONS = '[User] LoadUserPublishedQuestions',
    LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS = '[User] LoadUserPublishedQuestionsSuccess',
    LOAD_USER_UNPUBLISHED_QUESTIONS = '[User] LoadUserUnpublishedQuestions',
    LOAD_USER_UNPUBLISHED_QUESTIONS_SUCCESS = '[User] LoadUserUnpublishedQuestionsSuccess',
    ADD_QUESTION = '[User] AddQuestions',
    ADD_QUESTION_SUCCESS = '[User] AddQuestionsSuccess',
    UPDATE_USER_SUCCESS = '[User] UpdateUserSuccess',
    ADD_USER_INVITATION = '[User] AddUserInvitation',
    ADD_USER_INVITATION_SUCCESS = '[User] AddUserInvitationSuccess',
    MAKE_FRIEND = '[User] MakeFriend',
    MAKE_FRIEND_SUCCESS = '[User] MakeFriendSuccess',
}

// Save user profile
export class AddUserProfile implements Action {
    readonly type = UserActionTypes.ADD_USER_PROFILE;
    constructor(public payload: { user: User }) { }
}

// Save user profile Success
export class AddUserProfileSuccess implements Action {
    readonly type = UserActionTypes.ADD_USER_PROFILE_SUCCESS;
    payload = null;
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

// Save user invitations
export class AddUserInvitation implements Action {
    readonly type = UserActionTypes.ADD_USER_INVITATION;
    constructor(public payload: any) { }
}

// Save user invitations success
export class AddUserInvitationSuccess implements Action {
    readonly type = UserActionTypes.ADD_USER_INVITATION_SUCCESS;
    payload = null;
}

// Save user invitations success
export class MakeFriend implements Action {
    readonly type = UserActionTypes.MAKE_FRIEND;
    constructor(public payload: any) { }
}

// Save user invitations success
export class MakeFriendSuccess implements Action {
    readonly type = UserActionTypes.MAKE_FRIEND_SUCCESS;
    payload = null;
}






export type UserActions
    = AddUserProfile
    | AddUserProfileSuccess
    | LoadUserPublishedQuestions
    | LoadUserPublishedQuestionsSuccess
    | LoadUserUnpublishedQuestions
    | LoadUserUnpublishedQuestionsSuccess
    | AddQuestion
    | UpdateUserSuccess
    | AddUserInvitation
    | AddUserInvitationSuccess
    | MakeFriendSuccess

