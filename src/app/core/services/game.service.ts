import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
import { User, GameOptions, Game, Question, PlayerQnA }     from '../../model';
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
    let gameIdSubject = new Subject<string>();
    let game: Game = new Game(gameOptions, user.userId);

    let dbGame = game.getDbModel(); //object to be saved

    let id = this.db.createId();
    dbGame.id = id;

    //Use the set method of the doc instead of the add method on the collection, so the id field of the data matches the id of the document
    this.db.doc('/games/' + id).set(dbGame).then(ref => {
      gameIdSubject.next(id);
    });
    return gameIdSubject;
  }

  getActiveGames(user: User): Observable<Game[]> {
    //TODO: Limit to a max
    return this.db.collection('/games', ref => ref.where('playerId_0', '==', user.userId).where('gameOver', '==', false))
              .valueChanges()
              .map(gs => gs.map(g => Game.getViewModel(g)));
  }

  getGame(gameId: string, user: User): Observable<Game> {
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
