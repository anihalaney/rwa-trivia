import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Game } from '../../../model';

export enum StatsActionTypes {
    GET_LEADERBOARD = '[Stats] GetLeaderBoard',
    GET_LEADERBOARD_SUCCESS = '[Stats] GetLeaderBoardSuccess'
}

// Get Score
export class GetLeaderBoard implements Action {
    readonly type = StatsActionTypes.GET_LEADERBOARD;
    constructor(public payload: { categoryList: any }) { }
}

// Get Score
export class GetLeaderBoardSuccess implements Action {
    readonly type = StatsActionTypes.GET_LEADERBOARD_SUCCESS;
    constructor(public payload: any) { }
}

export type StatsActions
    = GetLeaderBoard
    | GetLeaderBoardSuccess


