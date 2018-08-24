import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { User, Question, Game, Friends } from '../../../../../../shared-library/src/lib/shared/model';
import { UserActions, UserActionTypes } from '../actions';



// user Profile Status
export function userProfileSaveStatus(state: any = 'NONE', action: UserActions): String {
    switch (action.type) {
        case UserActionTypes.ADD_USER_PROFILE:
            return 'IN PROCESS';
        case UserActionTypes.ADD_USER_PROFILE_SUCCESS:
            return 'SUCCESS';
        case UserActionTypes.ADD_USER_INVITATION_SUCCESS:
            return 'INVITATION SUCCESS';
        case UserActionTypes.MAKE_FRIEND_SUCCESS:
            return 'MAKE FRIEND SUCCESS';
        default:
            return null;
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
export function getGameResult(state: any = [], action: UserActions):
    Game[] {
    switch (action.type) {
        case UserActionTypes.GET_GAME_RESULT_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

// Load User Published Question by userId
export function userFriends(state: any = null, action: UserActions): Friends {
    switch (action.type) {
        case UserActionTypes.LOAD_USER_FRIENDS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};
