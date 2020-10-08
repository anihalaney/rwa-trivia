import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { RouterStateUrl } from '../../../shared/model';
import { TagActions, ActionWithPayload } from '../actions';
import { TagService } from '../../services';
import { map, filter, switchMap, tap } from 'rxjs/operators';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

@Injectable()
export class TagEffects {

    // Load tags based on url
    @Effect()
    // handle location update
    loadRouteTags$ = this.actions$
        .pipe(ofType(ROUTER_NAVIGATION))
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/')
            ))
        .pipe(
            switchMap(() =>
                this.svc.getTags()
                    .pipe(
                        map((tags: string[]) => this.tagActions.loadTagsSuccess(tags))
                    )));

    @Effect()
    getTopTags$ = this.actions$
        .pipe(ofType(TagActions.LOAD_TOP_TAGS))
        .pipe(
            switchMap(() => this.svc.getTopTags()),
            map((tags: any[]) => this.tagActions.loadTopTagsSuccess(tags))
        );
    constructor(
        private actions$: Actions,
        private tagActions: TagActions,
        private svc: TagService
    ) { }
}

