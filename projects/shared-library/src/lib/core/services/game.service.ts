import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, Observable, of, from } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CONFIG } from '../../environments/environment';
import { Game, GameOperations, GameOptions, GameStatus, PlayerQnA, Question, ReportQuestion, User } from '../../shared/model';
import { DbService } from './../db-service';

@Injectable()
export class GameService {
  constructor(private http: HttpClient,
    private dbService: DbService) {
  }

  createNewGame(gameOptions: GameOptions, user: User): Observable<string> {
    const url = `${CONFIG.functionsUrl}/game`;
    const payload = { gameOptions: gameOptions, userId: user.userId };
    return this.http.post<string>(url, payload);
  }

  getActiveGames(user: User): Observable<Game[]> {
    if (user && user.userId) {
      // in query only support up to 10 values
      const queryParams1 = {
        condition: [{ name: 'playerId_0', comparator: '==', value: user.userId },
        { name: 'gameOver', comparator: '==', value: false },
        {
          name: 'GameStatus', comparator: 'in',
          value: [GameStatus.STARTED, GameStatus.RESTARTED, GameStatus.WAITING_FOR_NEXT_Q,
          GameStatus.AVAILABLE_FOR_OPPONENT, GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE,
          GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE, GameStatus.JOINED_GAME]
        }
        ]
      };

      const userGames = this.dbService.valueChanges('games', '', queryParams1);

      const queryParams2 = {
        condition: [{ name: 'playerId_1', comparator: '==', value: user.userId },
        { name: 'gameOver', comparator: '==', value: false },
        { name: 'GameStatus', comparator: 'in', value: [GameStatus.JOINED_GAME, GameStatus.WAITING_FOR_NEXT_Q] }
        ]
      };

      const OtherGames = this.dbService.valueChanges('games', '', queryParams2);

      return combineLatest([userGames, OtherGames])
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
            myTurnGames = myTurnGames.sort((a: any, b: any) => a.turnAt - b.turnAt);
            notMyTurnGames = notMyTurnGames.sort((a: any, b: any) => b.turnAt - a.turnAt);
            return myTurnGames.concat(notMyTurnGames);
          }));

    } else {
      return of<Game[]>([]);
    }
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
    const url = `${CONFIG.functionsUrl}/question/next/`;
    return this.http.post<Question>(url + game.gameId, {});
  }


  addPlayerQnAToGame(gameId: string, playerQnA: PlayerQnA): Observable<any> {
    const url = `${CONFIG.functionsUrl}/game/${gameId}`;
    const payload = {
      playerQnA: playerQnA,
      operation: GameOperations.CALCULATE_SCORE
    };
    return this.http.put<any>(url, payload);
  }


  setGameOver(gameId: string) {
    return this.http.put(`${CONFIG.functionsUrl}/game/${gameId}`,
      {
        operation: GameOperations.GAME_OVER
      });
  }

  updateGameRound(gameId: string) {
    return this.http.put(`${CONFIG.functionsUrl}/game/${gameId}`,
      {
        operation: GameOperations.UPDATE_ROUND
      });
  }

  rejectGameInvitation(gameId: string) {
    return this.http.put(`${CONFIG.functionsUrl}/game/${gameId}`,
      {
        operation: GameOperations.REJECT_GAME
      });
  }

  getGameResult(user: User): Observable<Game[]> {
    if (user && user.userId) {

      const queryParams1 = {
        condition: [{ name: 'playerId_0', comparator: '==', value: user.userId },
        { name: 'gameOver', comparator: '==', value: true },
        ],
        orderBy: [{ name: 'gameOverAt', value: 'desc' }],
        limit: 20
      };

      const query1 = this.dbService.valueChanges('games', '', queryParams1);

      const queryParams2 = {
        condition: [{ name: 'playerId_1', comparator: '==', value: user.userId },
        { name: 'gameOver', comparator: '==', value: true },
        ],
        orderBy: [{ name: 'gameOverAt', value: 'desc' }],
        limit: 20
      };

      const query2 = this.dbService.valueChanges('games', '', queryParams2);

      return combineLatest(query1, query2)
        .pipe(
          map((data) => data[1].concat(data[0])),
          map(gs => gs.map(g => Game.getViewModel(g))
            .sort((a: any, b: any) => b.gameOverAt - a.gameOverAt)
          )
        );
    } else {
      return of<Game[]>([]);
    }

  }

  getGameInvites(user: User): Observable<Game[]> {
    if (user && user.userId) {
      const queryParams1 = {
        condition: [{ name: 'GameStatus', comparator: '==', value: GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE },
        { name: 'playerId_1', comparator: '==', value: user.userId },
        { name: 'gameOver', comparator: '==', value: false }
        ],
        orderBy: [{ name: 'turnAt', value: 'desc' }],
        limit: 20,
      };
      const query1 = this.dbService.valueChanges('games', '', queryParams1);
      const queryParams2 = {
        condition: [{ name: 'GameStatus', comparator: '==', value: GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE },
        { name: 'playerId_1', comparator: '==', value: user.userId },
        { name: 'gameOver', comparator: '==', value: false }
        ],
        orderBy: [{ name: 'turnAt', value: 'desc' }],
        limit: 20,
      };
      const query2 = this.dbService.valueChanges('games', '', queryParams2);
      return combineLatest(query1, query2)
        .pipe(map((data) => data[0].concat(data[1])),
          map(gs => gs.map(g => Game.getViewModel(g))
            .sort((a: any, b: any) => b.turnAt - a.turnAt)
          )
        );
    } else {
      return of<Game[]>([]);
    }
  }


  checkUserQuestion(playerQnA: PlayerQnA): Observable<Question> {

    return this.http.post<Question>(`${CONFIG.functionsUrl}/question/${playerQnA.questionId}`,
      {
        playerQnA: playerQnA
      });
  }

  getUsersAnsweredQuestion(userId: string, game: Game): Observable<Question[]> {
    const observables: Observable<Question>[] = [];

    for (const playerQnA of game.playerQnAs) {
      if (playerQnA.playerId === userId) {
        observables.push(this.checkUserQuestion(playerQnA));
      }
    }

    return forkJoin(observables);
  }

  saveReportQuestion(report: ReportQuestion, game: Game): Observable<any> {
    const dbReport = Object.assign({}, report);

    const queryParams = {
      condition: [{ name: 'created_uid', comparator: '==', value: report.created_uid },
      { name: 'gameId', comparator: '==', value: report.gameId }
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
    const url = `${CONFIG.functionsUrl}/game/${game.gameId}`;
    const payload = {
      playerQnA: playerQnA,
      operation: GameOperations.REPORT_STATUS
    };
    return this.http.put<any>(url, payload);
  }

  userReaction(questionId: string, userId: string, status: string): Observable<any> {
    const collection = `questions/${questionId}/reactions`;
    return from(this.dbService.getDoc(collection, userId).get()).pipe(map((res: any) => {
      const reaction = res.data();
      if (reaction) {
        if (status !== reaction.status) {
          return from(this.dbService.setDoc(collection, userId, { status: status }, { updatedOn: true }));
        } else {
          return from(this.dbService.deleteDoc(collection, userId));
        }
      } else {
        return from(this.dbService.setDoc(collection, userId, { status: status }, { createdOn: true, updatedOn: true }));
      }
    }));
  }

  getUserReaction(questionId: string, userId: string) {
    return this.dbService.valueChanges(`questions/${questionId}/reactions`, userId);
  }

  getQuestion(questionId: string) {
    return this.dbService.valueChanges(`questions`, questionId);
  }

  updateQuestionStat(questionId: string, type: string) {
    const url = `${CONFIG.functionsUrl}/question/question-stat-update/`;
    return this.http.post<Question>(url,
      { questionId: questionId, type: type === 'CREATED' ? type : 'UPDATED', update: type === 'CORRECT' ? true : false });
  }
}
