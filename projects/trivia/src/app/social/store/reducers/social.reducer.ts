import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Subscription, Subscribers, Blog } from '../../../../../../shared-library/src/lib/shared/model';
import { SocialActions, SocialActionTypes } from '../actions';
import { UploadTaskSnapshot } from 'angularfire2/storage/interfaces';

// add subscription Status
export function subscriptionSaveStatus(state: any = 'NONE', action: SocialActions): String {
    switch (action.type) {
        case SocialActionTypes.ADD_SUBSCRIBER:
            return 'IN PROCESS';
        case SocialActionTypes.ADD_SUBSCRIBER_SUCCESS:
            return 'SUCCESS';
        case SocialActionTypes.ADD_SUBSCRIBER_ERROR:
            return action.payload;
        default:
            return state;
    }
}

// return total subscription count 
export function getTotalSubscriptionStatus(state: any = [], action: SocialActions): Subscribers {
    switch (action.type) {
        case SocialActionTypes.TOTAL_SUBSCRIBER_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

// remove subscription Status
export function subscriptionRemoveStatus(state: any = 'NONE', action: SocialActions): String {
    switch (action.type) {
        case SocialActionTypes.REMOVE_SUBSCRIBER:
            return 'IN PROCESS';
        case SocialActionTypes.REMOVE_SUBSCRIBER_SUCCESS:
            return 'SUCCESS';
        default:
            return state;
    }
}

// return boolean value to check for subscription
export function checkEmailSubscriptionStatus(state: any = [], action: SocialActions): Boolean {
    switch (action.type) {
        case SocialActionTypes.CHECK_SUBSCRIPTION:
            return action.payload;
        default:
            return state;
    }
};

// return string value of social share image url
export function socialShareImageUrl(state: any = null, action: SocialActions): UploadTaskSnapshot {
    switch (action.type) {
        case SocialActionTypes.LOAD_SOCIAL_SCORE_SHARE_URL_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

// return blogs array
export function blogs(state: any = null, action: SocialActions): any {
    switch (action.type) {
        case SocialActionTypes.LOAD_BLOGS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

