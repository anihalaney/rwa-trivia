import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SystemStats } from '../../shared/model';

@Injectable()
export class StatsService {

    constructor(private db: AngularFirestore) { }

    loadLeaderBoardStat(): Observable<any> {
        return this.db.doc('/leader_board_stats/categories')
            .valueChanges()
            .pipe(map(lbsStat => lbsStat));
    }

    loadSystemStat(): Observable<SystemStats> {
        return this.db.doc('/stats/system')
            .valueChanges()
            .pipe(map(stat => stat));
    }
}
