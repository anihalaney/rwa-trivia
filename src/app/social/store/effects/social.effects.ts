import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

import { Subscription } from '../../../model';
import { SocialActions, SocialActionTypes } from '../actions';
import * as socialActions from '../actions/social.actions';
import { SocialService } from '../../../core/services';


@Injectable()
export class SocialEffects {

    constructor(
        private actions$: Actions,
        private socialService: SocialService,
    ) { }

    // Save subscription
    @Effect()
    addSubscription$ = this.actions$
        .ofType(SocialActionTypes.ADD_SUBSCRIBER)
        .pipe(
        switchMap((action: socialActions.AddSubscriber) => {
            this.socialService.saveSubscription(action.payload.subscription);
            return empty();
        })
        );

    // get total subscription
    @Effect()
    getTotalSubscription$ = this.actions$
        .ofType(SocialActionTypes.TOTAL_SUBSCRIBER)
        .pipe(
        switchMap((action: socialActions.GetTotalSubscriber) =>
            this.socialService.getTotalSubscription()
                .pipe(
                map((totalCount: Number) => new socialActions.GetTotalSubscriberSuccess(totalCount))
                )
        )
        );

    // Remove subscription
    @Effect()
    removeSubscription$ = this.actions$
        .ofType(SocialActionTypes.REMOVE_SUBSCRIBER)
        .pipe(
        switchMap((action: socialActions.RemoveSubscriber) => {
            this.socialService.removeSubscription(action.payload.created_uid);
            return empty();
        })
        );
}