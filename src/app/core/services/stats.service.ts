import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { LeaderBoardUser } from '../../model';

@Injectable()
export class StatsService {

    constructor(private db: AngularFirestore) { }

    loadLeaderBoardStat(): Observable<any> {
        return this.db.doc('/leader_board_stats/categories')
            .valueChanges()
            .map(lbsStat => lbsStat);
    }
}
