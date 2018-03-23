import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { Subscription } from '../../../model';
import { subscriptionSaveStatus } from './social.reducer';

export * from './social.reducer';

export interface SocialState {
    subscriptionSaveStatus: String;
}

export const reducer: ActionReducerMap<SocialState> = {
    subscriptionSaveStatus: subscriptionSaveStatus

};

export const socialState = createFeatureSelector<SocialState>('social');