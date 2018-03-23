import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Subscription } from '../../../model';
import { SocialActions, SocialActionTypes } from '../actions';


// user Profile Status
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
