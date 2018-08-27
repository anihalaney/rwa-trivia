import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Game, SystemStats } from '../../../../../../shared-library/src/lib/shared/model';

export enum StatsActionTypes {
    LOAD_LEADERBOARD = '[Stats] LoadLeaderBoard',
    LOAD_LEADERBOARD_SUCCESS = '[Stats] LoadLeaderBoardSuccess',
    LOAD_SYSTEM_STAT = '[Stats] LoadSystemStat',
    LOAD_SYSTEM_STAT_SUCCESS = '[Stats] LoadSystemStatSuccess',
    LOAD_SYSTEM_STAT_ERROR = '[Stats] LoadSystemStatError'
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

// Load System Stat
export class LoadSystemStat implements Action {
    readonly type = StatsActionTypes.LOAD_SYSTEM_STAT;
    constructor() { }
}

// Load System Stat
export class LoadSystemStatSuccess implements Action {
    readonly type = StatsActionTypes.LOAD_SYSTEM_STAT_SUCCESS;
    constructor(public payload: SystemStats) { }
}

// Load System Stat error
export class LoadSystemStatError implements Action {
    readonly type = StatsActionTypes.LOAD_SYSTEM_STAT_ERROR;
    constructor(public payload: string) { }
}

export type StatsActions
    = LoadLeaderBoard
    | LoadLeaderBoardSuccess
    | LoadSystemStat
    | LoadSystemStatSuccess
    | LoadSystemStatError


