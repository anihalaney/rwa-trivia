import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
// import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';
import { Subject } from 'rxjs/Subject';

import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
import { User, GameOptions, Game, Question, PlayerQnA, GameOperations } from '../../model';
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

    const userGames = this.db.collection('/games', ref => ref.where('playerId_0', '==', user.userId).where('gameOver', '==', false))
      .valueChanges();

    const OtherGames = this.db.collection('/games', ref => ref.where('playerId_1', '==', user.userId).where('gameOver', '==', false))
      .valueChanges();


    return Observable.combineLatest(userGames, OtherGames)
      .map(games => games[0].concat(games[1]))
      .map(gs => gs.map(g => Game.getViewModel(g))
        .sort((a: any, b: any) => { return (b.turnAt - a.turnAt) }))

  }

  getGame(gameId: string): Observable<Game> {
    return this.db.doc('/games/' + gameId)
      .valueChanges()
      .map(g => Game.getViewModel(g));
  }

  getNextQuestion(game: Game): Observable<Question> {
    const url: string = CONFIG.functionsUrl + '/app/getNextQuestion/';
    return this.http.get<Question>(url + game.gameId);
  }


  addPlayerQnAToGame(game: Game, playerQnA: PlayerQnA): Observable<any> {
    const url = `${CONFIG.functionsUrl}/app/game/${game.gameId}`;
    const payload = {
      playerQnA: playerQnA,
      nextTurnPlayerId: game.nextTurnPlayerId,
      GameStatus: game.GameStatus,
      turnAt: game.turnAt,
      operation: GameOperations.CALCULATE_SCORE
    };
    return this.http.put<any>(url, payload);
  }


  setGameOver(game: Game, user: User) {
    return this.http.put(`${CONFIG.functionsUrl}/app/game/${game.gameId}`,
      {
        gameOver: game.gameOver,
        winnerPlayerId: game.winnerPlayerId,
        GameStatus: game.GameStatus,
        operation: GameOperations.GAME_OVER
      });
  }

  getGameResult(userId: String): Observable<Game[]> {
    const query1 = this.db.collection('/games', ref => ref.where('playerId_0', '==', userId).where('gameOver', '==', true)
      .orderBy('turnAt', 'desc').limit(4))
      .valueChanges();

    const query2 = this.db.collection('/games', ref => ref.where('playerId_1', '==', userId).where('gameOver', '==', true)
      .orderBy('turnAt', 'desc').limit(4))
      .valueChanges();

    return Observable.combineLatest(query1, query2)
      .map((data) => data[0].concat(data[1]))
      .map(gs => gs.map(g => Game.getViewModel(g))
        .sort((a: any, b: any) => { return b.turnAt - a.turnAt; }));

  }
}
