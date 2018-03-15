import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { User, Question } from '../../../model';
import { UserActions, UserActionTypes } from '../actions';


// Load User Profile By Id
export function user(state: any = null, action: UserActions): User {
    switch (action.type) {
        case UserActionTypes.LOAD_USER_PROFILE_SUCCESS:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

// user Profile Status
export function userProfileSaveStatus(state: any = 'NONE', action: UserActions): String {
    switch (action.type) {
        case UserActionTypes.ADD_USER_PROFILE:
            return 'IN PROCESS';
        case UserActionTypes.ADD_USER_PROFILE_SUCCESS:
            return 'SUCCESS';
        case UserActionTypes.LOAD_USER_PROFILE:
            return 'NONE';
        default:
            return state;
    }
}


// Load User Published Question by userId
export function userPublishedQuestions(state: any = [], action: UserActions): Question[] {
    switch (action.type) {
        case UserActionTypes.LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

// Load User Unpublished Question by userId
export function userUnpublishedQuestions(state: any = [], action: UserActions): Question[] {
    switch (action.type) {
        case UserActionTypes.LOAD_USER_UNPUBLISHED_QUESTIONS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};


export function questionSaveStatus(state: any = 'NONE', action: UserActions): string {
    switch (action.type) {
        case UserActionTypes.ADD_QUESTION:
            return 'IN PROGRESS';
        default:
            return state;
    }
};
