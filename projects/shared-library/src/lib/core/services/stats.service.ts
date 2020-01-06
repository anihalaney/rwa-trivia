import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionConstants, SystemStats } from '../../shared/model';
import { DbService } from './../db-service';
import { catchError } from 'rxjs/operators';
import * as stringHash from 'string-hash';

@Injectable()
export class StatsService {

    constructor(private dbService: DbService) { }

    loadLeaderBoardStat(categoryList: Array<{id: string, type: string}>) {
        const queryParams = {
            condition: [],
            orderBy: [{ name: 'score', value: 'desc' }],
            limit: 10
        };
        const gamesPlayedWithObs = categoryList.map(catObj => {
            const id = catObj.type === 'tag' ? stringHash(catObj.id) : catObj.id;
            return this.dbService.valueChanges(`${CollectionConstants.LEADER_BOARD_STATS}/${id}/stat`, '', queryParams);
        });
        return combineLatest(gamesPlayedWithObs)
            .pipe(map((values) => {
                return values.map((value, index) => {
                    if (value) {
                        value = { id : categoryList[index].id, users: value, type: categoryList[index].type };
                        return value;
                    } else {
                        value = {};
                        value = { id : categoryList[index].id, users: {}, type: categoryList[index].type };
                        return value;
                    }
                });
            }),
                catchError(error => {
                    console.log(error);
                    return of(null);
                }));
    }

    loadSystemStat(): Observable<SystemStats> {
        return this.dbService
            .valueChanges('stats', 'system')
            .pipe(map(stat => stat));
    }
}
