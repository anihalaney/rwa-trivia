import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, combineLatest, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CONFIG } from '../../environments/environment';
import {
  User, GameOptions, Game, Question, PlayerQnA, GameOperations,
  GameStatus, ReportQuestion, QuestionMetadata
} from '../../shared/model';
import { GameActions } from '../store/actions';
import { DbService } from './../db-service';

@Injectable()
export class GameService {
  constructor(private http: HttpClient,
    private gameActions: GameActions,
    private dbService: DbService) {
  }

  createNewGame(gameOptions: GameOptions, user: User): Observable<string> {
    const url: string = CONFIG.functionsUrl + '/app/game';
    const payload = { gameOptions: gameOptions, userId: user.userId };
    return this.http.post<string>(url, payload);
  }

  getActiveGames(user: User): Observable<Game[]> {
    const queryParams1 = {
      condition: [{ name: "playerId_0", comparator: "==", value: user.userId },
      { name: "gameOver", comparator: "==", value: false },
      { name: "GameStatus", comparator: "==", value: GameStatus.STARTED }
      ]
    };

    const userGames1 = this.dbService.valueChanges('games', '', queryParams1);

    const queryParams2 = {
      condition: [{ name: "playerId_0", comparator: "==", value: user.userId },
      { name: "gameOver", comparator: "==", value: false },
      { name: "GameStatus", comparator: "==", value: GameStatus.RESTARTED }
      ]
    };

    const userGames2 = this.dbService.valueChanges('games', '', queryParams2);


    const queryParams3 = {
      condition: [{ name: "playerId_0", comparator: "==", value: user.userId },
      { name: "gameOver", comparator: "==", value: false },
      { name: "GameStatus", comparator: "==", value: GameStatus.WAITING_FOR_NEXT_Q }
      ]
    };

    const userGames3 = this.dbService.valueChanges('games', '', queryParams3);

    const queryParams4 = {
      condition: [{ name: "playerId_0", comparator: "==", value: user.userId },
      { name: "gameOver", comparator: "==", value: false },
      { name: "GameStatus", comparator: "==", value: GameStatus.AVAILABLE_FOR_OPPONENT }
      ]
    };

    const userGames4 = this.dbService.valueChanges('games', '', queryParams4);

    const queryParams5 = {
      condition: [{ name: "playerId_0", comparator: "==", value: user.userId },
      { name: "gameOver", comparator: "==", value: false },
      { name: "GameStatus", comparator: "==", value: GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE }
      ]
    };

    const userGames5 = this.dbService.valueChanges('games', '', queryParams5);


    const queryParams6 = {
      condition: [{ name: "playerId_0", comparator: "==", value: user.userId },
      { name: "gameOver", comparator: "==", value: false },
      { name: "GameStatus", comparator: "==", value: GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE }
      ]
    };

    const userGames6 = this.dbService.valueChanges('games', '', queryParams6);

    const queryParams7 = {
      condition: [{ name: "playerId_1", comparator: "==", value: user.userId },
      { name: "gameOver", comparator: "==", value: false },
      { name: "GameStatus", comparator: "==", value: GameStatus.JOINED_GAME }
      ]
    };

    const OtherGames2 = this.dbService.valueChanges('games', '', queryParams7);

    const queryParams8 = {
      condition: [{ name: "playerId_1", comparator: "==", value: user.userId },
      { name: "gameOver", comparator: "==", value: false },
      { name: "GameStatus", comparator: "==", value: GameStatus.WAITING_FOR_NEXT_Q }
      ]
    };

    const OtherGames3 = this.dbService.valueChanges('games', '', queryParams8);

    return combineLatest(userGames1, userGames2, userGames3, userGames4, userGames5, userGames6, OtherGames2, OtherGames3)
      .pipe(
        map(games => [].concat.apply([], games)),
        map(gs => gs.map(g => Game.getViewModel(g))),
        map(games => {
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
        }));
  }

  getGame(gameId: string): Observable<Game> {
    return this.dbService.valueChanges('games', gameId)
      .pipe(map(
        g => {
          g['id'] = (g['id']) ? g['id'] : gameId;
          return Game.getViewModel(g);
        }
      ));
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

  updateGameRound(gameId: string) {
    return this.http.put(`${CONFIG.functionsUrl}/app/game/${gameId}`,
      {
        operation: GameOperations.UPDATE_ROUND
      });
  }

  rejectGameInvitation(gameId: string) {
    return this.http.put(`${CONFIG.functionsUrl}/app/game/${gameId}`,
      {
        operation: GameOperations.REJECT_GAME
      });
  }


  getGameResult(userId: String): Observable<Game[]> {

    const queryParams1 = {
      condition: [{ name: "playerId_0", comparator: "==", value: userId },
      { name: "gameOver", comparator: "==", value: true },
      ],
      orderBy: [{ name: "turnAt", value: 'desc' }],
      limit: 4
    };

    const query1 = this.dbService.valueChanges('games', '', queryParams1);

    const queryParams2 = {
      condition: [{ name: "playerId_1", comparator: "==", value: userId },
      { name: "gameOver", comparator: "==", value: true },
      ],
      orderBy: [{ name: "turnAt", value: 'desc' }],
      limit: 4
    };

    const query2 = this.dbService.valueChanges('games', '', queryParams2);

    return combineLatest(query1, query2)
      .pipe(
        map((data) => data[0].concat(data[1])),
        map(gs => gs.map(g => Game.getViewModel(g))
          .sort((a: any, b: any) => { return b.turnAt - a.turnAt; })
        )
      );
  }

  getGameInvites(userId: String): Observable<Game[]> {

    const queryParams1 = {
      condition: [{ name: "GameStatus", comparator: "==", value: GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE },
      { name: "playerId_1", comparator: "==", value: userId },
      { name: "gameOver", comparator: "==", value: false }
      ],
      orderBy: [{ name: "turnAt", value: 'desc' }]
    };

    const query1 = this.dbService.valueChanges('games', '', queryParams1);

    const queryParams2 = {
      condition: [{ name: "GameStatus", comparator: "==", value: GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE },
      { name: "playerId_1", comparator: "==", value: userId },
      { name: "gameOver", comparator: "==", value: false }
      ],
      orderBy: [{ name: "turnAt", value: 'desc' }]
    };

    const query2 = this.dbService.valueChanges('games', '', queryParams2);

    return combineLatest(query1, query2)
      .pipe(map((data) => data[0].concat(data[1])),
        map(gs => gs.map(g => Game.getViewModel(g))
          .sort((a: any, b: any) => { return b.turnAt - a.turnAt; })
        )
      );
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
      if (playerQnA.playerId === userId) {
        observables.push(this.checkUserQuestion(playerQnA));
      }

    });
    return forkJoin(observables);
  }

  saveReportQuestion(report: ReportQuestion, game: Game): Observable<any> {
    const dbReport = Object.assign({}, report);

    const queryParams = {
      condition: [{ name: "created_uid", comparator: "==", value: report.created_uid },
      { name: "gameId", comparator: "==", value: report.gameId }
      ]
    };

    return this.dbService.valueChanges('report_questions', '', queryParams).pipe(
      take(1),
      map(question => {
        if (question.length > 0) {
          const reportQuestion = new ReportQuestion();
          reportQuestion.questions = question[0]['questions'];
          const key = Object.keys(report.questions)[0];
          reportQuestion.questions[key] = report.questions[key];

          return of(this.dbService.updateDoc('report_questions', dbReport.gameId, { questions: reportQuestion.questions }));
        } else {
          return of(this.dbService.setDoc('report_questions', dbReport.gameId, dbReport));
        }
      }));
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
