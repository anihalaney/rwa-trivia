import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
import { User, GameOptions, Game, Question, PlayerQnA, GameStatus, PlayerMode, OpponentType } from '../../model';
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

    // const gameIdSubject = new Subject<string>();
    // if (Number(gameOptions.playerMode) === PlayerMode.Opponent
    //   && Number(gameOptions.opponentType) === OpponentType.Random) {
    //   this.joinGame(gameOptions, user, gameIdSubject);
    // } else {
    //   this.createGame(gameOptions, user, gameIdSubject);
    // }

    const url: string = CONFIG.functionsUrl + '/app/createGame';
    const payload = { gameOptions: gameOptions, userId: user.userId };
    return this.http.post<string>(url, payload);

  }

  joinGame(gameOptions: GameOptions, user: User, gameIdSubject: Subject<string>) {

    this.db.collection('/games', ref => ref.where('GameStatus', '==', GameStatus.WAITING_FOR_NEXT_Q)
      .where('nextTurnPlayerId', '==', '').where('gameOver', '==', false))
      .snapshotChanges().take(1).map(gs => gs.map(g => Game.getViewModel(g.payload.doc.data()))).subscribe(queriedItems => {
        const totalGames = queriedItems.length;
        if (totalGames > 0) {
          this.pickRandomGame(gameOptions, user, queriedItems, totalGames, gameIdSubject);
        } else {
          this.createGame(gameOptions, user, gameIdSubject);
        }
      });

  }

  pickRandomGame(gameOptions: GameOptions, user: User, queriedItems: Array<Game>, totalGames: number,
    gameIdSubject: Subject<string>) {
    const randomGameNo = Math.floor(Math.random() * totalGames);
    const game = queriedItems[randomGameNo];
    if (game.playerIds[0] !== user.userId) {
      game.nextTurnPlayerId = user.userId;
      game.addPlayer(user.userId);
      const dbGame = game.getDbModel();
      this.db.doc('/games/' + game.gameId).update(dbGame).then(ref => {
        gameIdSubject.next(game.gameId);
      });
    } else if (totalGames === 1) {
      this.createGame(gameOptions, user, gameIdSubject);
    } else {
      totalGames--;
      queriedItems.splice(randomGameNo, 1);
      this.pickRandomGame(gameOptions, user, queriedItems, totalGames, gameIdSubject);
    }
  }

  createGame(gameOptions: GameOptions, user: User, gameIdSubject: Subject<string>) {
    const game = new Game(gameOptions, user.userId, undefined, undefined, false, user.userId, undefined, undefined,
      GameStatus.STARTED, new Date().getTime(), new Date().getTime());
    const dbGame = game.getDbModel(); // object to be saved

    const id = this.db.createId();
    dbGame.id = id;

    // Use the set method of the doc instead of the add method on the collection, so the id field of the data matches the id of the document
    this.db.doc('/games/' + id).set(dbGame).then(ref => {
      gameIdSubject.next(id);
    });

  }

  getActiveGames(user: User): Observable<Game[]> {
    const gamesSubject = new Subject<Game[]>();
    //TODO: Limit to a max
    // this.db.collection('/games', ref => ref.where('gameOver', '==', false))
    //   .valueChanges()
    //   .map(gs => gs.map(g => Game.getViewModel(g))).subscribe(GamesWithCurrentUser => {
    //     let activeGames = [];
    //     for (const game of GamesWithCurrentUser) {
    //       if (game.playerIds.indexOf(user.userId) !== -1) {
    //         activeGames.push(game);
    //         activeGames = activeGames.sort(function (a, b) {
    //           return a.turnAt - b.turnAt;
    //         });
    //       }
    //     }
    //     gamesSubject.next(activeGames);
    //   });

    this.db.collection('/games', ref => ref.where('playerId_0', '==', user.userId).where('gameOver', '==', false))
      .valueChanges()
      .map(gs => gs.map(g => Game.getViewModel(g))).subscribe(GamesWithCurrentUser => {
        let activeGames = GamesWithCurrentUser;
        this.db.collection('/games', ref => ref.where('playerId_1', '==', user.userId).where('gameOver', '==', false))
          .valueChanges()
          .map(gs => gs.map(g => Game.getViewModel(g))).subscribe(GamesWithOtherUser => {
            activeGames = GamesWithCurrentUser.concat(GamesWithOtherUser);
            activeGames = activeGames.sort(function (a, b) {
              return a.turnAt - b.turnAt;
            });
            gamesSubject.next(activeGames);
          });
      });
    return gamesSubject;
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
