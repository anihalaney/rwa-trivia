import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { empty } from 'rxjs/observable/empty';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import { StatsActionTypes, StatsActions } from '../actions';
import * as statsActions from '../actions/stats.actions';
import { StatsService } from '../../../core/services';
import { Game } from '../../../model';


@Injectable()
export class StatsEffects {

    // Get Score
    @Effect()
    getLeaderBoardInfo$ = this.actions$
        .ofType(StatsActionTypes.GET_LEADERBOARD)
        .pipe(
        switchMap((action: statsActions.GetLeaderBorad) =>
            this.statsService.getScoreInfo(action.payload.categoryList).pipe(
                map((score: any) =>
                    new statsActions.GetLeaderBoradSuccess(score)
                )
            )));

    constructor(
        private actions$: Actions,
        private statsService: StatsService
    ) { }
}
