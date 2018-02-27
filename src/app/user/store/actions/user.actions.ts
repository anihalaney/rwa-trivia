import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { User } from '../../../model';

export enum UserActionTypes {
    ADD_USER_PROFILE = '[User] AddUserProfile',
    ADD_USER_PROFILE_SUCCESS = '[User] AddUserProfileSuccess',
    LOAD_USER_PROFILE = '[User] LoadUserProfile',
    LOAD_USER_PROFILE_SUCCESS = '[User] LoadUserProfileSuccess'
}

export class AddUserProfile implements Action {
    readonly type = UserActionTypes.ADD_USER_PROFILE;
    constructor(public payload: { user: User }) { }
}

export class AddUserProfileSuccess implements Action {
    readonly type = UserActionTypes.ADD_USER_PROFILE_SUCCESS;
    payload = null;
}

export class LoadUserProfile implements Action {
    readonly type = UserActionTypes.LOAD_USER_PROFILE;
    constructor(public payload: { user: User }) { }
}

export class LoadUserProfileSuccess implements Action {
    readonly type = UserActionTypes.LOAD_USER_PROFILE_SUCCESS;
    constructor(public payload: User) { }
}


export type UserActions
    = AddUserProfile
    | AddUserProfileSuccess
    | LoadUserProfile
    | LoadUserProfileSuccess
