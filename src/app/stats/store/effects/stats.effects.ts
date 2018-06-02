import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { empty } from 'rxjs/observable/empty';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import { StatsActionTypes, StatsActions } from '../actions';
import * as statsActions from '../actions/stats.actions';
import { StatsService } from '../../../core/services';
import { Game, SystemStats } from '../../../model';


@Injectable()
export class StatsEffects {

    // Load Score
    @Effect()
    LoadLeaderBoardInfo$ = this.actions$
        .ofType(StatsActionTypes.LOAD_LEADERBOARD)
        .pipe(
        switchMap((action: statsActions.LoadLeaderBoard) =>
            this.statsService.loadLeaderBoardStat().pipe(
                map((score: any) =>
                    new statsActions.LoadLeaderBoardSuccess(score)
                )
            )));

    // Load System Stat
    @Effect()
    LoadSystemStat$ = this.actions$
        .ofType(StatsActionTypes.LOAD_SYSTEM_STAT)
        .pipe(
        switchMap((action: statsActions.LoadSystemStat) =>
            this.statsService.loadSystemStat().pipe(
                map((stat: SystemStats) =>
                    new statsActions.LoadSystemStatSuccess(stat)
                )
            )));

    constructor(
        private actions$: Actions,
        private statsService: StatsService
    ) { }
}
