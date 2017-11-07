import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';
//import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
import { User, GameOptions, Game, Question, PlayerQnA }     from '../../model';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { GameActions } from '../store/actions';
import { Utils } from '../services/utils';

@Injectable()
export class GameService {
  constructor(private db: AngularFireDatabase,
              private http: HttpClient,
              private store: Store<AppStore>,
              private gameActions: GameActions) { 
  }

  createNewGame(gameOptions: GameOptions, user: User): Observable<string> {
    let gameIdSubject = new Subject<string>();
    let game: Game = new Game(gameOptions, user.userId);
    this.db.list('/games').push(game.getDbModel()).then(
      (ret) => {  //success
        let gameId: string = ret.key;
        if (gameId) {
          this.db.object('/users/' + user.userId + '/games/active').update({[gameId]: "true"});
          gameIdSubject.next(gameId)
        }
      },
      (error: Error) => {//error
        console.error(error);
      }
    );
    return gameIdSubject;
  }

  getActiveGames(user: User): Observable<Game[]> {
    //TODO: Limit to a max
    return this.db.list('/users/' + user.userId + '/games/active').snapshotChanges()
    .map(gids => gids.map(gid => gid.payload.key))  //game ids
    .mergeMap((gids: string[]) => {
      return Observable.forkJoin(
        gids.map((gameId : string) => 
          this.db.object('/games/' + gameId).snapshotChanges().take(1)
            .map(action => {
              const $key = action.payload.key;
              const data = { $key, ...action.payload.val() };
              return data;
            })
            .map(g => Game.getViewModel(g))
        )
      )
    });
  }

  getGame(gameId: string, user: User): Observable<Game> {
    return this.db.object('/games/' + gameId).snapshotChanges()
      .map(action => {
          const $key = action.payload.key;
          const data = { $key, ...action.payload.val() };
          return data;
        })
      .map(dbGame => {
        //console.log(dbGame);
        return Game.getViewModel(dbGame);
      })
      .catch(error => {
        console.log(error);
        return Observable.of(null);
      });
  }

  getNextQuestion(game: Game): Observable<Question> {
    let url: string = CONFIG.functionsUrl + "/app/getNextQuestion/";
    return this.http.get<Question>(url + game.gameId);
  }
/*
  getNextQuestion(game: Game, user: User): Observable<Question[]> {
    //let random = Utils.getRandomInt(1, 20);
    return this.db.list('/questions/published', {
      query: {
        limitToLast: 1
      }
    }).map(qs => 
      qs.map(q => {
        q["id"] = q['$key']; //map key to quesion id
        //this.addQuestionToGame(game, user, q);
        return q
      })
    );
  }
*/
  addQuestionToGame(game: Game, user: User, question: Question) {

    let playerQnA: PlayerQnA = game.addPlayerQnA(user.userId, question.id);
    this.db.list('/games/' + game.gameId + '/playerQnA').push(playerQnA);

  }

  addPlayerQnAToGame(game: Game, playerQnA: PlayerQnA) {
    this.db.list('/games/' + game.gameId + '/playerQnA').push(playerQnA)
        .then((ret)=>{
          //success
        });
  }

  setGameOver(game: Game, user: User) {
    this.db.object('/games/' + game.gameId).update({gameOver: true})
        .then((ret)=>{
          //success
          //remove game from user's active list and add to inactive list
          this.db.object('/users/' + user.userId + '/games/active/' + game.gameId).remove();
          this.db.object('/users/' + user.userId + '/games/inactive').update({[game.gameId]: "true"});
        });
  }
}
