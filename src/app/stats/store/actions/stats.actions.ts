import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Game } from '../../../model';

export enum StatsActionTypes {
    LOAD_LEADERBOARD = '[Stats] LoadLeaderBoard',
    LOAD_LEADERBOARD_SUCCESS = '[Stats] LoadLeaderBoardSuccess'
}

// Load Score
export class LoadLeaderBoard implements Action {
    readonly type = StatsActionTypes.LOAD_LEADERBOARD;
    constructor() { }
}

// Load Score
export class LoadLeaderBoardSuccess implements Action {
    readonly type = StatsActionTypes.LOAD_LEADERBOARD_SUCCESS;
    constructor(public payload: any) { }
}

export type StatsActions
    = LoadLeaderBoard
    | LoadLeaderBoardSuccess


