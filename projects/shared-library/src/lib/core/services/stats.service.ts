import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SystemStats, CollectionConstants } from '../../shared/model';
import { DbService } from './../db-service';

@Injectable()
export class StatsService {

    constructor(private dbService: DbService) { }

    loadLeaderBoardStat(): Observable<any[]> {
        return this.dbService.valueChanges(CollectionConstants.LEADER_BOARD_STATS);
    }

    loadSystemStat(): Observable<SystemStats> {
        return this.dbService
            .valueChanges('stats', 'system')
            .pipe(map(stat => stat));
    }
}
