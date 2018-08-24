import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { switchMap, map, filter, catchError } from 'rxjs/operators';

import { SocialService } from '../../../../../../shared-library/src/lib/core/services';
import { Subscribers, Blog, RouterStateUrl } from '../../../../../../shared-library/src/lib/shared/model';
import { SocialActionTypes } from '../actions';
import * as socialActions from '../actions/social.actions';
import { UploadTaskSnapshot } from 'angularfire2/storage/interfaces';
import { of } from 'rxjs';


@Injectable()
export class SocialEffects {
    // Save subscription
    @Effect()
    addSubscription$ = this.actions$
        .ofType(SocialActionTypes.ADD_SUBSCRIBER)
        .pipe(
            switchMap((action: socialActions.AddSubscriber) =>
                this.socialService.checkSubscription(action.payload.subscription)
                    .pipe(
                        map(isSubscribed => {
                            if (isSubscribed) {
                                return new socialActions.CheckSubscriptionStatus(true);
                            } else {
                                this.socialService.saveSubscription(action.payload.subscription)
                                return new socialActions.CheckSubscriptionStatus(false);
                            }
                        }), catchError(err => of(new socialActions.AddSubscriberError(err))))

            ));

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


    // Load Social Score share url
    @Effect()
    loadSocialScoreShareUrl$ = this.actions$
        .ofType(SocialActionTypes.LOAD_SOCIAL_SCORE_SHARE_URL)
        .pipe(
            switchMap((action: socialActions.LoadSocialScoreShareUrl) =>
                this.socialService.generateScoreShareImage(action.payload.imageBlob, action.payload.userId)
                    .pipe(
                        map((imageUrl: UploadTaskSnapshot) => new socialActions.LoadSocialScoreShareUrlSuccess(imageUrl)))
            ));


    // load blogs
    @Effect()
    getBlogs$ = this.actions$
        .ofType('ROUTER_NAVIGATION')
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/')))
        .pipe(
            switchMap(() =>
                this.socialService.loadBlogs()
                    .pipe(
                        map((blogs: Blog[]) => new socialActions.LoadBlogsSuccess(blogs)),
                        catchError(err => of(new socialActions.LoadBlogsError(err)))
                    )
            )
        );

    constructor(
        private actions$: Actions,
        private socialService: SocialService
    ) { }
}