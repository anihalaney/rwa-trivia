import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { Subscription, Subscribers, Blog } from '../../../model';
import {
    subscriptionSaveStatus, getTotalSubscriptionStatus,
    subscriptionRemoveStatus, checkEmailSubscriptionStatus,
    socialShareImageUrl, blogs
} from './social.reducer';

export * from './social.reducer';

export interface SocialState {
    subscriptionSaveStatus: String;
    getTotalSubscriptionStatus: Subscribers;
    subscriptionRemoveStatus: String;
    checkEmailSubscriptionStatus: Boolean;
    socialShareImageUrl: String;
    blogs: Blog[];
}

export const reducer: ActionReducerMap<SocialState> = {
    subscriptionSaveStatus: subscriptionSaveStatus,
    getTotalSubscriptionStatus: getTotalSubscriptionStatus,
    subscriptionRemoveStatus: subscriptionRemoveStatus,
    checkEmailSubscriptionStatus: checkEmailSubscriptionStatus,
    socialShareImageUrl: socialShareImageUrl,
    blogs: blogs
};

export const socialState = createFeatureSelector<SocialState>('social');
