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
    constructor(public payload: { categoryList: any }) { }
}

// Get Score
export class GetLeaderBoradSuccess implements Action {
    readonly type = StatsActionTypes.GET_LEADERBOARD_SUCCESS;
    constructor(public payload: any) { }
}

export type StatsActions
    = GetLeaderBorad
    | GetLeaderBoradSuccess


