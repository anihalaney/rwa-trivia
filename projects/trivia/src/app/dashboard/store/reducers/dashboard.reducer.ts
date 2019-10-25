import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { AchievementRule, Subscribers, Question } from 'shared-library/shared/model';
import { DashboardActions, DashboardActionTypes } from '../actions';

// add subscription Status
export function subscriptionSaveStatus(state: any = 'NONE', action: DashboardActions): String {
    switch (action.type) {
        case DashboardActionTypes.ADD_SUBSCRIBER:
            return 'IN PROCESS';
        case DashboardActionTypes.ADD_SUBSCRIBER_SUCCESS:
            return 'SUCCESS';
        case DashboardActionTypes.ADD_SUBSCRIBER_ERROR:
            return action.payload;
        default:
            return state;
    }
}

// return total subscription count
export function getTotalSubscriptionStatus(state: any = [], action: DashboardActions): Subscribers {
    switch (action.type) {
        case DashboardActionTypes.TOTAL_SUBSCRIBER_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

// remove subscription Status
export function subscriptionRemoveStatus(state: any = 'NONE', action: DashboardActions): String {
    switch (action.type) {
        case DashboardActionTypes.REMOVE_SUBSCRIBER:
            return 'IN PROCESS';
        case DashboardActionTypes.REMOVE_SUBSCRIBER_SUCCESS:
            return 'SUCCESS';
        default:
            return state;
    }
}

// return boolean value to check for subscription
export function checkEmailSubscriptionStatus(state: any = [], action: DashboardActions): Boolean {
    switch (action.type) {
        case DashboardActionTypes.CHECK_SUBSCRIPTION:
            return action.payload;
        default:
            return state;
    }
}

// return string value of social share image url
export function socialShareImageUrl(state: any = null, action: DashboardActions): UploadTaskSnapshot {
    switch (action.type) {
        case DashboardActionTypes.LOAD_SOCIAL_SCORE_SHARE_URL_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

// return blogs array
export function blogs(state: any = null, action: DashboardActions): any {
    switch (action.type) {
        case DashboardActionTypes.LOAD_BLOGS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

export function scoreBoard(state: any = null, action: DashboardActions): any {
    switch (action.type) {
        case DashboardActionTypes.LOAD_LEADERBOARD_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

export function systemStat(state: any = null, action: DashboardActions): any {
    switch (action.type) {
        case DashboardActionTypes.LOAD_SYSTEM_STAT_SUCCESS:
            return action.payload;
        case DashboardActionTypes.LOAD_SYSTEM_STAT_ERROR:
            return action.payload;
        default:
            return state;
    }
}

export function achievements(state: any = null, action: DashboardActions): AchievementRule[] {

    switch (action.type) {
        case DashboardActionTypes.LOAD_ACHIEVEMENTS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

// Load User Latest Question by userId
export function userLatestPublishedQuestion(state: any = [], action: DashboardActions): Question {
    switch (action.type) {
        case DashboardActionTypes.LOAD_USER_LATEST_PUBLISHED_QUESTION_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}