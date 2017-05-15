import { Injectable }    from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import '../../rxjs-extensions';

import { User, GameOptions, Game, Question, PlayerQnA }     from '../../model';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/app-store';
import { GameActions } from '../store/actions';
import { Utils } from '../services/utils';

@Injectable()
export class GameService {
  constructor(private af: AngularFire,
              private store: Store<AppStore>,
              private gameActions: GameActions) { 
  }

  createNewGame(gameOptions: GameOptions, user: User): Observable<string> {
    let gameIdSubject = new Subject<string>();
    let game: Game = new Game(gameOptions, user.userId);
    this.af.database.list('/games').push(game.getDbModel()).then(
      (ret) => {  //success
        let gameId: string = ret.key;
        if (gameId) {
          this.af.database.object('/users/' + user.userId + '/games/active').update({[gameId]: "true"});
          gameIdSubject.next(gameId)
        }
      },
      (error: Error) => {//error
        console.error(error);
      }
    );
    return gameIdSubject;
  }

  getActiveGames(user: User): Observable<string[]>{
    return this.af.database.list('/users/' + user.userId + '/games/active')
            .map(gids => gids.map(gid => gid['$key'])); //game ids
  }

  getGame(gameId: string, user: User): Observable<Game> {
    return this.af.database.object('/games/' + gameId)
              .map(dbGame => {
                //console.log(dbGame);
                return Game.getViewModel(dbGame);
              })
              .catch(error => {
                console.log(error);
                return Observable.of(null);
              });
  }

  getNextQuestion(game: Game, user: User): Observable<Question[]> {
    //let random = Utils.getRandomInt(1, 20);
    return this.af.database.list('/questions/published', {
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

  addQuestionToGame(game: Game, user: User, question: Question) {

    let playerQnA: PlayerQnA = game.addPlayerQnA(user.userId, question.id);
    this.af.database.list('/games/' + game.gameId + '/playerQnA').push(playerQnA);

  }

  addPlayerQnAToGame(game: Game, playerQnA: PlayerQnA) {
    this.af.database.list('/games/' + game.gameId + '/playerQnA').push(playerQnA)
        .then((ret)=>{
          //success
        });
  }

  setGameOver(game: Game, user: User) {
    this.af.database.object('/games/' + game.gameId).update({gameOver: true})
        .then((ret)=>{
          //success
          //remove game from user's active list and add to inactive list
          this.af.database.object('/users/' + user.userId + '/games/active/' + game.gameId).remove();
          this.af.database.object('/users/' + user.userId + '/games/inactive').update({[game.gameId]: "true"});
        });
  }
}
