import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { scoreBoard } from './stats.reducers';

export interface LeaderBoardState {
    scoreBoard: any

}

export const reducer: ActionReducerMap<LeaderBoardState> = {
    scoreBoard: scoreBoard

};

export const leaderBoardState = createFeatureSelector<LeaderBoardState>('stats');
