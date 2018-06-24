import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { LeaderBoardUser, SystemStats } from '../../model';

@Injectable()
export class StatsService {

    constructor(private db: AngularFirestore) { }

    loadLeaderBoardStat(): Observable<any> {
        return this.db.doc('/leader_board_stats/categories')
            .valueChanges()
            .map(lbsStat => lbsStat);
    }

    loadSystemStat(): Observable<SystemStats> {
        return this.db.doc('/stats/system')
            .valueChanges()
            .map(stat => stat);
    }
}
