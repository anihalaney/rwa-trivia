import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Subscription, Subscribers, User } from '../../../model';

export enum SocialActionTypes {

    ADD_SUBSCRIBER = '[Social] AddSubscriber',
    ADD_SUBSCRIBER_SUCCESS = '[Social] AddSubscriberSuccess',
    REMOVE_SUBSCRIBER = '[Social] RemoveSubscriber',
    REMOVE_SUBSCRIBER_SUCCESS = '[Social] RemoveSubscriberSuccess',
    TOTAL_SUBSCRIBER = '[Social] TotalSubscriber',
    TOTAL_SUBSCRIBER_SUCCESS = '[Social] TotalSubscriberSuccess',
    CHECK_SUBSCRIPTION = '[Social] CheckSubscriptionStatus'
}

// Save subscriber
export class AddSubscriber implements Action {
    readonly type = SocialActionTypes.ADD_SUBSCRIBER;
    constructor(public payload: { subscription: Subscription, user: User }) { }
}

// Save subscriber Success
export class AddSubscriberSuccess implements Action {
    readonly type = SocialActionTypes.ADD_SUBSCRIBER_SUCCESS;
    payload = null;
}

// Get total subscriber
export class GetTotalSubscriber implements Action {
    readonly type = SocialActionTypes.TOTAL_SUBSCRIBER;
    payload = null;
}

// Get total subscriber Success
export class GetTotalSubscriberSuccess implements Action {
    readonly type = SocialActionTypes.TOTAL_SUBSCRIBER_SUCCESS;
    constructor(public payload: Subscribers) { }
}

// Remove subscriber
export class RemoveSubscriber implements Action {
    readonly type = SocialActionTypes.REMOVE_SUBSCRIBER;
    constructor(public payload: { created_uid: String }) { }
}

// Save subscriber Success
export class RemoveSubscriberSuccess implements Action {
    readonly type = SocialActionTypes.REMOVE_SUBSCRIBER_SUCCESS;
    payload = null;
}

// Get total subscriber Success
export class CheckSubscriptionStatus implements Action {
    readonly type = SocialActionTypes.CHECK_SUBSCRIPTION;
    constructor(public payload: Boolean) { }
}

export type SocialActions
    = AddSubscriber
    | AddSubscriberSuccess
    | GetTotalSubscriber
    | GetTotalSubscriberSuccess
    | RemoveSubscriber
    | RemoveSubscriberSuccess
    | CheckSubscriptionStatus

