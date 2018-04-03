import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

import { Subscription, Subscribers } from '../../../model';
import { SocialActions, SocialActionTypes } from '../actions';
import * as socialActions from '../actions/social.actions';
import { SocialService } from '../../../core/services';


@Injectable()
export class SocialEffects {
    // Save subscription
    @Effect()
    addSubscription$ = this.actions$
        .ofType(SocialActionTypes.ADD_SUBSCRIBER)
        .pipe(
        switchMap((action: socialActions.AddSubscriber) =>
            this.socialService.saveSubscription(action.payload.subscription).pipe(
                map((flag: boolean) => new socialActions.CheckSubscriptionStatus(flag)))
        )
        );

    // get total subscription
    @Effect()
    getTotalSubscription$ = this.actions$
        .ofType(SocialActionTypes.TOTAL_SUBSCRIBER)
        .pipe(
        switchMap((action: socialActions.GetTotalSubscriber) =>
            this.socialService.getTotalSubscription()
                .pipe(
                map((totalCount: Subscribers) => new socialActions.GetTotalSubscriberSuccess(totalCount))
                )
        )
        );

    constructor(
        private actions$: Actions,
        private socialService: SocialService,
    ) { }
}
