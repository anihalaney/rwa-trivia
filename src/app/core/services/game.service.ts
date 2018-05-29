import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/forkJoin';
import { Subject } from 'rxjs/Subject';

import '../../rxjs-extensions';

import { CONFIG } from '../../../environments/environment';
import { User, GameOptions, Game, Question, PlayerQnA, GameOperations, GameStatus, ReportQuestion, QuestionMetadata } from '../../model';
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
    const url: string = CONFIG.functionsUrl + '/app/game';
    const payload = { gameOptions: gameOptions, userId: user.userId };
    return this.http.post<string>(url, payload);

  }


  getActiveGames(user: User): Observable<Game[]> {

    const userGames1 = this.db.collection('/games', ref => ref.where('playerId_0', '==', user.userId).where('gameOver', '==', false)
      .where('GameStatus', '==', GameStatus.STARTED))
      .valueChanges();

    const userGames2 = this.db.collection('/games', ref => ref.where('playerId_0', '==', user.userId).where('gameOver', '==', false)
      .where('GameStatus', '==', GameStatus.RESTARTED))
      .valueChanges();


    const userGames3 = this.db.collection('/games', ref => ref.where('playerId_0', '==', user.userId).where('gameOver', '==', false)
      .where('GameStatus', '==', GameStatus.WAITING_FOR_NEXT_Q))
      .valueChanges();

    const userGames4 = this.db.collection('/games', ref => ref.where('playerId_0', '==', user.userId).where('gameOver', '==', false)
      .where('GameStatus', '==', GameStatus.AVAILABLE_FOR_OPPONENT))
      .valueChanges();


    const OtherGames1 = this.db.collection('/games', ref => ref.where('playerId_1', '==', user.userId).where('gameOver', '==', false)
      .where('GameStatus', '==', GameStatus.RESTARTED))
      .valueChanges();

    const OtherGames2 = this.db.collection('/games', ref => ref.where('playerId_1', '==', user.userId).where('gameOver', '==', false)
      .where('GameStatus', '==', GameStatus.JOINED_GAME))
      .valueChanges();

    const OtherGames3 = this.db.collection('/games', ref => ref.where('playerId_1', '==', user.userId).where('gameOver', '==', false)
      .where('GameStatus', '==', GameStatus.WAITING_FOR_NEXT_Q))
      .valueChanges();


    return Observable.combineLatest(userGames1, userGames2, userGames3, userGames4, OtherGames1, OtherGames2, OtherGames3)
      .map(games => [].concat.apply([], games))
      .map(gs => gs.map(g => Game.getViewModel(g)))
      .map(games => {
        let myTurnGames = [];
        let notMyTurnGames = [];
        games.map(gameObj => {
          if (gameObj.nextTurnPlayerId === user.userId) {
            myTurnGames.push(gameObj);
          } else {
            notMyTurnGames.push(gameObj);
          }
        });
        myTurnGames = myTurnGames.sort((a: any, b: any) => { return (a.turnAt - b.turnAt) });
        notMyTurnGames = notMyTurnGames.sort((a: any, b: any) => { return (b.turnAt - a.turnAt) });
        return myTurnGames.concat(notMyTurnGames);
      });
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
    const url: string = CONFIG.functionsUrl + '/app/question/next/';
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

  getGameInvites(userId: String): Observable<Game[]> {

    const query1 = this.db.collection('/games',
      ref => ref.where('GameStatus', '==', GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE)
        .where('playerId_1', '==', userId).where('gameOver', '==', false)
        .orderBy('turnAt', 'desc'))
      .valueChanges();

    const query2 = this.db.collection('/games',
      ref => ref.where('GameStatus', '==', GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE)
        .where('playerId_1', '==', userId).where('gameOver', '==', false)
        .orderBy('turnAt', 'desc'))
      .valueChanges();

    return Observable.combineLatest(query1, query2)
      .map((data) => data[0].concat(data[1]))
      .map(gs => gs.map(g => Game.getViewModel(g))
        .sort((a: any, b: any) => { return b.turnAt - a.turnAt; }));

  }

  checkUserQuestion(playerQnA: PlayerQnA): Observable<any> {

    return this.http.post(`${CONFIG.functionsUrl}/app/question/${playerQnA.questionId}`,
      {
        playerQnA: playerQnA
      });
  }

  getUsersAnsweredQuestion(userId: string, game: Game): Observable<Question[]> {
    const observables = [];

    game.playerQnAs.map(playerQnA => {
      observables.push(this.checkUserQuestion(playerQnA));
    });
    return Observable.forkJoin(observables);
  }

  saveReportQuestion(report: ReportQuestion, game: Game): Observable<any> {
    const dbReport = Object.assign({}, report);
    return this.db.collection(`/report_questions`, ref => ref.where('created_uid', '==', report.created_uid).
      where('gameId', '==', report.gameId))
      .valueChanges().take(1)
      .map(question => {
        if (question.length > 0) {
          const reportQuestion = new ReportQuestion();
          reportQuestion.questions = question[0]['questions'];
          const key = Object.keys(report.questions)[0];
          reportQuestion.questions[key] = report.questions[key];
          return Observable.of(this.db.doc(`/report_questions/${dbReport.gameId}`).update({ questions: reportQuestion.questions }));

        } else {
          return Observable.of(this.db.doc(`/report_questions/${dbReport.gameId}`).set(dbReport));
        }
      });
  }

  updateGame(report: ReportQuestion, game: Game): Observable<any> {
    let playerQnA = new PlayerQnA();
    playerQnA = game.playerQnAs.filter(info => info.questionId === Object.keys(report.questions)[0])[0];
    playerQnA.isReported = true;
    const url = `${CONFIG.functionsUrl}/app/game/${game.gameId}`;
    const payload = {
      playerQnA: playerQnA,
      operation: GameOperations.REPORT_STATUS
    };
    return this.http.put<any>(url, payload);

  }
}
