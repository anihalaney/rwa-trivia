import { Injectable } from '@angular/core';
import { map, filter, switchMap, mergeMap, take } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ApplicationSettingsActions } from '../actions';
import { Category, RouterStateUrl } from '../../../shared/model';
import { ApplicationSettingsService } from '../../services';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { CoreState, coreState } from '../reducers';

@Injectable()
export class ApplicationSettingsEffects {

    // Load ApplicationSettings based on url
    @Effect()
    // handle location update
    loadRouteApplicationSettings$ = this.actions$
        .pipe(ofType(ROUTER_NAVIGATION))
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/')),
            mergeMap((routerState: RouterStateUrl) =>
                this.store.select(coreState).pipe(
                    map(s => s.user),
                    filter(u => !!u),
                    take(1),
                    map(user => user.userId))
            ))
        .pipe(
            switchMap(() => {
                return this.svc.getApplicationSettings()
                    .pipe(
                        map((applicationSettings: any[]) => {
                            return this.applicationSettingsActions.loadApplicationSettingsSuccess(applicationSettings);
                        })
                    );
            })
        );

    constructor(
        private actions$: Actions,
        private applicationSettingsActions: ApplicationSettingsActions,
        private svc: ApplicationSettingsService,
        private store: Store<CoreState>
    ) { }
}
