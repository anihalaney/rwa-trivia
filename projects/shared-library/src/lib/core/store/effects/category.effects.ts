import { Injectable } from '@angular/core';
import { map, filter, switchMap, exhaustMap } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { CategoryActions, ActionWithPayload } from '../actions';
import { Category, RouterStateUrl } from '../../../shared/model';
import { CategoryService } from '../../services';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

@Injectable()
export class CategoryEffects {

    // Load categories based on url
    @Effect()
    // handle location update
    loadRouteCategories$ = this.actions$
        .pipe(ofType(ROUTER_NAVIGATION))
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/')))
        .pipe(
            switchMap(() => {
                return this.svc.getCategories()
                    .pipe(
                        map((categories: Category[]) => {

                            return this.categoryActions.loadCategoriesSuccess(categories);
                        })
                    );
            })
        );

    @Effect()
    getActiveGames$ = this.actions$
        .pipe(ofType(CategoryActions.LOAD_TOP_CATEGORIES))
        .pipe(
            map((action: ActionWithPayload<any[]>) => action.payload),
            switchMap((payload:any) => this.svc.getTopCategories()),
            map((categories: any[]) => this.categoryActions.loadTopCategoriesSuccess(categories))
        );

    constructor(
        private actions$: Actions,
        private categoryActions: CategoryActions,
        private svc: CategoryService
    ) { }
}
