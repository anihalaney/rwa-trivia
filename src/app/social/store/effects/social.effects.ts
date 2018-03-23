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

    // Save sunscription
    @Effect()
    addSubscription$ = this.actions$
        .ofType(SocialActionTypes.ADD_SUBSCRIBER)
        .pipe(
        switchMap((action: socialActions.AddSubscriber) => {
            this.socialService.saveSubscription(action.payload.subscription);
            return empty();
        })
        );
}