import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Game } from '../../model';

@Injectable()
export class StatsService {

    constructor(private db: AngularFirestore) { }

    getScoreInfo(): Observable<Game[]> {
        return this.db.collection('/games', ref => ref.where('gameOver', '==', true).limit(3))
            .valueChanges()
            .map(gs => gs.map(g => {
                if (Game.getViewModel(g).winnerPlayerId !== undefined) {
                    console.log(JSON.stringify(Game.getViewModel(g).gameId));
                    return Game.getViewModel(g)
                }

            }))
    }
}
