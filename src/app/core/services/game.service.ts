import { Injectable }    from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import '../../rxjs-extensions';

import { User, GameOptions, Game, Question }     from '../../model';
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
    let tmp = new Subject<string>();
    let game: Game = new Game(gameOptions, user.userId);
//console.log(game);
    this.af.database.list('/games').push(game.getDbGameModel()).then(
      (ret) => {  //success
//console.log(ret);
        let gameId: string = ret.key;
        if (gameId) {
          this.af.database.object('/users/' + user.userId + '/games/active').update({[gameId]: "true"});
          tmp.next(gameId)
          
        }
      },
      (error: Error) => {//error
        console.error(error);
      }
    );
    return tmp;
  }

  getGame(gameId: string): Observable<Game> {
    return this.af.database.object('/games/' + gameId)
              .map(dbGame => {
                //console.log(dbGame);
                return Game.getGameModel(dbGame);
              })
              .catch(error => {
                console.log(error);
                return Observable.of(null);
              });
  }

  getNextQuestion(gameId: string): Observable<Question[]> {
    //let random = Utils.getRandomInt(1, 20);
    return this.af.database.list('/questions/published', {
      query: {
        limitToLast: 1
      }
    });
  }
}
