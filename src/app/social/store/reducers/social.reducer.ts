import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Subscription } from '../../../model';
import { SocialActions, SocialActionTypes } from '../actions';

//add subscription Status
export function subscriptionSaveStatus(state: any = 'NONE', action: SocialActions): String {
    switch (action.type) {
        case SocialActionTypes.ADD_SUBSCRIBER:
            return 'IN PROCESS';
        case SocialActionTypes.ADD_SUBSCRIBER_SUCCESS:
            return 'SUCCESS';
        default:
            return state;
    }
}

export function getTotalSubscriptionStatus(state: any = [], action: SocialActions): Number {
    switch (action.type) {
        case SocialActionTypes.TOTAL_SUBSCRIBER_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

//remove subscription Status
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

