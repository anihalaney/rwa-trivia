import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { StatsActions, StatsActionTypes } from '../actions';

export function scoreBoard(state: any = [], action: StatsActions): any {
    switch (action.type) {
        case StatsActionTypes.LOAD_LEADERBOARD_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}
