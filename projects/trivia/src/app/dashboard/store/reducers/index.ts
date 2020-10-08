import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { Subscription, Subscribers, Blog, Question } from 'shared-library/shared/model';
import {
    subscriptionSaveStatus, getTotalSubscriptionStatus,
    subscriptionRemoveStatus, checkEmailSubscriptionStatus,
    socialShareImageUrl, blogs, scoreBoard, systemStat, achievements,
    userLatestPublishedQuestion
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
    achievements: any;
    userLatestPublishedQuestion: Question;
}

export const reducer: ActionReducerMap<DashboardState> = {
    subscriptionSaveStatus: subscriptionSaveStatus,
    getTotalSubscriptionStatus: getTotalSubscriptionStatus,
    subscriptionRemoveStatus: subscriptionRemoveStatus,
    checkEmailSubscriptionStatus: checkEmailSubscriptionStatus,
    socialShareImageUrl: socialShareImageUrl,
    blogs: blogs,
    scoreBoard: scoreBoard,
    systemStat: systemStat,
    achievements: achievements,
    userLatestPublishedQuestion: userLatestPublishedQuestion
};

export const dashboardState = createFeatureSelector<DashboardState>('dashboard');
