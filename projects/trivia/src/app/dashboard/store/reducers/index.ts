import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { Subscription, Subscribers, Blog } from 'shared-library/shared/model';
import {
    subscriptionSaveStatus, getTotalSubscriptionStatus,
    subscriptionRemoveStatus, checkEmailSubscriptionStatus,
    socialShareImageUrl, blogs, scoreBoard, systemStat
} from './dashboard.reducer';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

export * from './dashboard.reducer';

export interface DashboardState {
    subscriptionSaveStatus: String;
    getTotalSubscriptionStatus: Subscribers;
    subscriptionRemoveStatus: String;
    checkEmailSubscriptionStatus: Boolean;
    socialShareImageUrl: UploadTaskSnapshot;
    blogs: any;
    scoreBoard: any;
    systemStat: any;
}

export const reducer: ActionReducerMap<DashboardState> = {
    subscriptionSaveStatus: subscriptionSaveStatus,
    getTotalSubscriptionStatus: getTotalSubscriptionStatus,
    subscriptionRemoveStatus: subscriptionRemoveStatus,
    checkEmailSubscriptionStatus: checkEmailSubscriptionStatus,
    socialShareImageUrl: socialShareImageUrl,
    blogs: blogs,
    scoreBoard: scoreBoard,
    systemStat: systemStat
};

export const dashboardState = createFeatureSelector<DashboardState>('dashboard');
