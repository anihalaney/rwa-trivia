import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { StatsActions, StatsActionTypes } from '../actions';
import { SystemStats } from '../../../model';

export function scoreBoard(state: any = null, action: StatsActions): any {
    switch (action.type) {
        case StatsActionTypes.LOAD_LEADERBOARD_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

export function systemStat(state: any = null, action: StatsActions): SystemStats {
    switch (action.type) {
        case StatsActionTypes.LOAD_SYSTEM_STAT_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}
