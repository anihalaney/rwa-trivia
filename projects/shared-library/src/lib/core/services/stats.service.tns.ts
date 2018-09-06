import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SystemStats } from '../../shared/model';

@Injectable()
export class StatsService {

    constructor() { }

    loadLeaderBoardStat(): Observable<any> {
        // return this.db.doc('/leader_board_stats/categories')
        //     .valueChanges()
        //     .pipe(map(lbsStat => lbsStat));
        return of({});
    }

    loadSystemStat(): Observable<SystemStats> {
        // return this.db.doc('/stats/system')
        //     .valueChanges()
        //     .pipe(map(stat => stat));
        return of({});
    }
}
