import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

export interface StatsState {

}

export const reducer: ActionReducerMap<StatsState> = {

};

export const socialState = createFeatureSelector<StatsState>('stats');