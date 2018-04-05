import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Game } from '../../../model';

export enum StatsActionTypes {
    GET_LEADERBOARD = '[Stats] GetLeaderBorad',
    GET_LEADERBOARD_SUCCESS = '[Stats] GetLeaderBoradSuccess'
}

// Get Score
export class GetLeaderBorad implements Action {
    readonly type = StatsActionTypes.GET_LEADERBOARD;
    payload = null;
}

// Get Score
export class GetLeaderBoradSuccess implements Action {
    readonly type = StatsActionTypes.GET_LEADERBOARD_SUCCESS;
    constructor(public payload: Game[]) { }
}

export type StatsActions
    = GetLeaderBorad
    | GetLeaderBoradSuccess


