import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { scoreBoard, systemStat } from './stats.reducers';

export interface LeaderBoardState {
    scoreBoard: any,
    systemStat: any
}

export const reducer: ActionReducerMap<LeaderBoardState> = {
    scoreBoard: scoreBoard,
    systemStat: systemStat
};

export const leaderBoardState = createFeatureSelector<LeaderBoardState>('stats');
