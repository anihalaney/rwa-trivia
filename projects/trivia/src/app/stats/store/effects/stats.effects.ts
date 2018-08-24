import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { StatsActionTypes } from '../actions';
import * as statsActions from '../actions/stats.actions';
import { StatsService } from '../../../../../../shared-library/src/lib/core/services';
import { SystemStats } from '../../../../../../shared-library/src/lib/shared/model';
import { of } from 'rxjs';


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
                    ), catchError(err => of(new statsActions.LoadSystemStatError(err)))
                )));

    constructor(
        private actions$: Actions,
        private statsService: StatsService
    ) { }
}
