import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { Subscription } from '../../../model';
import {
    subscriptionSaveStatus, getTotalSubscriptionStatus,
    subscriptionRemoveStatus, checkEmailSubscriptionStatus
} from './social.reducer';

export * from './social.reducer';

export interface SocialState {
    subscriptionSaveStatus: String;
    getTotalSubscriptionStatus: Number;
    subscriptionRemoveStatus: String;
    checkEmailSubscriptionStatus: Boolean;
}

export const reducer: ActionReducerMap<SocialState> = {
    subscriptionSaveStatus: subscriptionSaveStatus,
    getTotalSubscriptionStatus: getTotalSubscriptionStatus,
    subscriptionRemoveStatus: subscriptionRemoveStatus,
    checkEmailSubscriptionStatus: checkEmailSubscriptionStatus

};

export const socialState = createFeatureSelector<SocialState>('social');