import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { RouterStateUrl } from '../../../shared/model';
import { TagActions } from '../actions';
import { TagService } from '../../services'
import { map, filter, switchMap, tap } from 'rxjs/operators';

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
        .pipe(
            ofType('ROUTER_NAVIGATION'))
            .pipe(
            map((action: any): RouterStateUrl => {
                console.log('action', action);
            return  action.payload.routerState
            }),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/')
            ));           
    
        // .pipe(
        //     map((action: any): RouterStateUrl => action.payload.routerState),
        //     filter((routerState: RouterStateUrl) =>
        //         routerState.url.toLowerCase().startsWith('/')
        //     ))
        // .pipe(
        //     switchMap(() =>
        //         this.svc.getTags()
        //             .pipe(
        //                 map((tags: string[]) => this.tagActions.loadTagsSuccess(tags))
        //             )));

}

