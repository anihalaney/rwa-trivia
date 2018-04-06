import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { StatsActions, StatsActionTypes } from '../actions';

export function scoreBorad(state: any = [], action: StatsActions): any {
    switch (action.type) {
        case StatsActionTypes.GET_LEADERBOARD_SUCCESS:
            return action.payload;
        default:
            return null;
    }
}
