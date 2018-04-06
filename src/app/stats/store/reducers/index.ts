import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { scoreBorad } from './stats.reducers';

export interface StatsState {
    scoreBorad: any

}

export const reducer: ActionReducerMap<StatsState> = {
    scoreBorad: scoreBorad

};

export const statsState = createFeatureSelector<StatsState>('stats');