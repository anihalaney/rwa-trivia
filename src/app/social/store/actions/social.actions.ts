import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Subscription } from '../../../model';

export enum SocialActionTypes {

    ADD_SUBSCRIBER = '[Social] AddSubscriber',
    ADD_SUBSCRIBER_SUCCESS = '[Social] AddSubscriberSuccess',
    REMOVE_SUBSCRIBER = '[Social] RemoveSubscriber',
    REMOVE_SUBSCRIBER_SUCCESS = '[Social] RemoveSubscriberSuccess',
    TOTAL_SUBSCRIBER = '[Social] TotalSubscriber',
    TOTAL_SUBSCRIBER_SUCCESS = '[Social] TotalSubscriberSuccess'
}

// Save subscriber
export class AddSubscriber implements Action {
    readonly type = SocialActionTypes.ADD_SUBSCRIBER;
    constructor(public payload: { subscription: Subscription }) { }
}

// Save subscriber Success
export class AddSubscriberSuccess implements Action {
    readonly type = SocialActionTypes.ADD_SUBSCRIBER_SUCCESS;
    payload = null;
}

export type SocialActions
    = AddSubscriber
    | AddSubscriberSuccess

