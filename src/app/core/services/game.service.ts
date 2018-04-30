import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
// import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';
import { Subject } from 'rxjs/Subject';

import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
import { User, GameOptions, Game, Question, PlayerQnA, GameOperations, QuestionStatus } from '../../model';
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
      .map(
      g => {
        g['id'] = (g['id']) ? g['id'] : gameId;
        return Game.getViewModel(g);
      }
      );
  }

  getNextQuestion(game: Game): Observable<Question> {
    const url: string = CONFIG.functionsUrl + '/app/getNextQuestion/';
    return this.http.get<Question>(url + game.gameId);
  }


  addPlayerQnAToGame(gameId: string, playerQnA: PlayerQnA): Observable<any> {
    const url = `${CONFIG.functionsUrl}/app/game/${gameId}`;
    const payload = {
      playerQnA: playerQnA,
      operation: GameOperations.CALCULATE_SCORE
    };
    return this.http.put<any>(url, payload);
  }


  setGameOver(gameId: string) {
    return this.http.put(`${CONFIG.functionsUrl}/app/game/${gameId}`,
      {
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

  getUsersAnsweredQuestion(userId: string, game: Game): Observable<Question[]> {
    const questionArray = [];
    let index = 0;
    const questionList = game.playerQnAs.filter((question) => question.playerId === userId);
    return this.checkUserQuestion(questionList, userId, index, questionArray).expand((question) => {
      questionArray.push(question);
      if (questionArray.length !== questionList.length) {
        index++;
        return this.checkUserQuestion(questionList, userId, index, questionArray);
      } else {
        return Observable.empty();
      }
    });
  }

  checkUserQuestion(playerQnAs: any, userId: string, index: number, questionArray: any): Observable<any> {
    const array = playerQnAs[index];
    if (array.playerId === userId) {
      return this.db.doc(`/questions/${array.questionId}`)
        .snapshotChanges()
        .take(1)
        .map(qs => {
          const question = Question.getViewModelFromDb(qs.payload.data());
          if (array.playerAnswerId !== null) {
            const answerObj = question.answers[array.playerAnswerId];
            question.userGivenAnswer = answerObj.answerText;
          } else {
            question.userGivenAnswer = null;
          }
          return question;
        })
    }
  }
}


