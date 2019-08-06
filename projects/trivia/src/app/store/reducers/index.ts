import { ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import { ActionReducerMap, createFeatureSelector, ActionReducer, Action, MetaReducer } from '@ngrx/store';
import { RouterStateUrl } from 'shared-library/shared/model';
import { UserActions } from 'shared-library/core/store/actions';

export interface State {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>
}

export const reducers: ActionReducerMap<State> = {
  routerReducer: fromRouter.routerReducer
}

export const routerState =
  createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('routerReducer');

export class CustomSerializer implements fromRouter.RouterStateSerializer<RouterStateUrl> {

  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;

    }

    const { params } = state;

    return { url, queryParams, params };
  }
}

export const rootState = (state: State) => state;


export function clearState(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state: any, action: Action): any {
    if (action.type === UserActions.LOGOFF) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
export const metaReducers: MetaReducer<any>[] = [clearState];
