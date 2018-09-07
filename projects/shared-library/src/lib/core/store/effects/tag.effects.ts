import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { RouterStateUrl } from '../../../shared/model';
import { TagActions } from '../actions';
import { TagService } from '../../services'
import { map, filter, switchMap } from 'rxjs/operators';

@Injectable()
export class TagEffects {
    constructor(
        private actions$: Actions,
        private tagActions: TagActions,
        private svc: TagService
    ) { }

    // Load tags based on url
    @Effect()
    // handle location update
    loadRouteCategories$ = this.actions$
        .ofType('ROUTER_NAVIGATION')
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

}

