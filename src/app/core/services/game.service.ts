import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
<<<<<<< HEAD
import { User, GameOptions, Game, Question, PlayerQnA } from '../../model';
=======
import { User, GameOptions, Game, Question, PlayerQnA, GameStatus, PlayerMode, OpponentType } from '../../model';
>>>>>>> 3cdc52e9908537a561c0f433607de22245b1071e
import { Store } from '@ngrx/store';
import { GameActions } from '../store/actions';
import { Utils } from '../services/utils';

@Injectable()
export class GameService {
  constructor(private db: AngularFirestore,
    private http: HttpClient,
    private gameActions: GameActions) {
  }

  createNewGame(gameOptions: GameOptions, user: User): Observable<string> {
    const url: string = CONFIG.functionsUrl + '/app/createGame';
    const payload = { gameOptions: gameOptions, userId: user.userId };
    return this.http.post<string>(url, payload);

  }

  getActiveGames(user: User): Observable<Game[]> {


    return this.db.collection('/games', ref => ref.where('playerId_0', '==', user.userId).where('gameOver', '==', false))
      .valueChanges()
      .map(gs => gs.map(g => Game.getViewModel(g)))
      .mergeMap((userGames) => {
        return this.db.collection('/games', ref => ref.where('playerId_1', '==', user.userId).where('gameOver', '==', false))
          .valueChanges()
          .map(gs => gs.map(g => Game.getViewModel(g)))
          .map(otherUserGames => {
            userGames = userGames.concat(otherUserGames);
            return userGames.sort((a: any, b: any) => { return b - a; });
          })
      });
  }

  getGame(gameId: string): Observable<Game> {
    return this.db.doc('/games/' + gameId)
      .valueChanges()
      .map(g => Game.getViewModel(g));
  }

  getNextQuestion(game: Game): Observable<Question> {
    let url: string = CONFIG.functionsUrl + "/app/getNextQuestion/";
    return this.http.get<Question>(url + game.gameId);
  }
  addPlayerQnAToGame(game: Game, playerQnA: PlayerQnA) {
    game.playerQnAs.push(playerQnA);
    let dbGame = game.getDbModel();

    this.db.doc('/games/' + game.gameId).update(dbGame);
  }

  setGameOver(game: Game, user: User) {
    let dbGame = game.getDbModel();
    dbGame.gameOver = true;
    this.db.doc('/games/' + game.gameId).update(dbGame);
  }
}
