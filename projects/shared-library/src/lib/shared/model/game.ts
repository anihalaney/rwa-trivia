import { GameOptions, GameStatus, PlayerMode, OpponentType } from './game-options';

export class PlayerQnA {
  playerId: string;
  questionId: string;
  playerAnswerId?: string;
  playerAnswerInSeconds?: number;
  answerCorrect?: boolean;
  isReported?: boolean;
  addedOn?: number;
  round?: number;
  badge?: { name: string, won: boolean};
  categoryId?: number[];
}

export class Stat {
  score: number;
  avgAnsTime: number;
  consecutiveCorrectAnswers: number;
  badge: string[];
  constructor() {
    this.score = 0;
    this.avgAnsTime = 0;
    this.consecutiveCorrectAnswers = 0;
    this.badge = [];
  }
}

export class GamePlayedWith {
  date: number;
  created_uid: string;
  gamePlayed: number;
  losses: number;
  wins: number;
}

export class Game {
  private _gameId?: string;
  private _gameOptions: GameOptions;
  private _playerIds: string[];
  public gameOver: boolean;
  public playerQnAs: PlayerQnA[];
  public stats: { [key: string]: Stat };
  public nextTurnPlayerId: string;
  public winnerPlayerId: string;
  public GameStatus: string;
  public createdAt: number;
  public turnAt: number;
  public gameOverAt: number;
  public round: number;
  public reminder32Min: boolean;
  public reminder8Hr: boolean;

  constructor(gameOptions: GameOptions, player1UUId: string, gameId?: string, playerQnAs?: any, gameOver?: boolean,
    nextTurnPlayerId?: string, player2UUId?: string, winnerPlayerId?: string, gameStatus?: string, createdAt?: number, turnAt?: number,
    gameOverAt?: number, round?: number, reminder32Min?: boolean, reminder8Hr?: boolean) {
    //defaults
    this._gameOptions = gameOptions;
    this._playerIds = [player1UUId];
    if (player2UUId) {
      (this._playerIds.indexOf(player2UUId) === -1) ? this._playerIds.push(player2UUId) : '';
    }
    this.nextTurnPlayerId = nextTurnPlayerId ? nextTurnPlayerId : '';
    this.gameOver = (gameOver) ? true : false;
    this.playerQnAs = [];
    if (playerQnAs) {
      let key: string;
      for (key of Object.keys(playerQnAs)) {
        const qna = playerQnAs[key];
        const playerOnA: PlayerQnA = new PlayerQnA();
        playerOnA.playerId = qna.playerId;
        playerOnA.questionId = qna.questionId;
        (qna['addedOn'] !== undefined) ? playerOnA.addedOn = qna.addedOn : '';
        (qna['playerAnswerId'] !== undefined) ? playerOnA.playerAnswerId = qna.playerAnswerId : '';
        (qna['playerAnswerInSeconds'] !== undefined) ? playerOnA.playerAnswerInSeconds = qna.playerAnswerInSeconds : '';
        (qna['answerCorrect'] !== undefined) ? playerOnA.answerCorrect = qna.answerCorrect : '';
        (qna['round'] !== undefined) ? playerOnA.round = qna.round : '';
        (qna['categoryId'] !== undefined) ? playerOnA.categoryId = qna.categoryId : '';
        (qna['badge'] !== undefined) ? playerOnA.badge = qna.badge : '';
        // console.log(playerOnA.categoryId, '=== ');
        playerOnA.isReported = (qna.isReported) ? true : false;
        this.playerQnAs.push({ ...playerOnA });
      }
    }
    if (gameId) {
      this._gameId = gameId;
    }

    if (winnerPlayerId) {
      this.winnerPlayerId = winnerPlayerId;
    }

    if (gameStatus) {
      this.GameStatus = gameStatus;
    }

    if (createdAt) {
      this.createdAt = createdAt;
    }

    if (turnAt) {
      this.turnAt = turnAt;
    }

    if (gameOverAt) {
      this.gameOverAt = gameOverAt;
    }

    if (reminder32Min) {
      this.reminder32Min = reminder32Min;
    } else {
      this.reminder32Min = false;
    }


    if (reminder8Hr) {
      this.reminder8Hr = reminder8Hr;
    } else {
      this.reminder8Hr = false;
    }

    this.stats = {};
    this.round = (round) ? round : 1;
  }

  addPlayer(playerUUId: string) {
    (this._playerIds.indexOf(playerUUId) === -1) ? this._playerIds.push(playerUUId) : '';
  }

  setStat(gameStats: any) {

    if (gameStats) {
      for (const key of Object.keys(gameStats)) {
        const stat: Stat = gameStats[key];
        this.stats[key] = stat;
      }
    } else {
      this.generateDefaultStat();
    }

  }

  generateDefaultStat() {
    this.playerIds.map((playerId) => {
      const stat: Stat = new Stat();
      this.stats[playerId] = stat;
    });
  }

  get gameOptions(): GameOptions {
    return this._gameOptions;
  }
  get playerIds(): string[] {
    return this._playerIds;
  }
  get gameId(): string {
    return this._gameId;
  }

  addPlayerQnA(playerId: string, questionId: string): PlayerQnA {
    const playerQnA: PlayerQnA = {
      'playerId': playerId,
      'questionId': questionId
    };

    this.playerQnAs.push(playerQnA);
    return playerQnA;
  }

  calculateStat(playerId: string) {
    const consecutiveCorrectAnswers = (this.stats && this.stats[playerId] && this.stats[playerId].consecutiveCorrectAnswers) ?
      this.stats[playerId].consecutiveCorrectAnswers : 0;
    const stat: Stat = new Stat();
    stat.score = this.playerQnAs.filter((p) => p.answerCorrect && p.playerId === playerId).length;
    stat.badge = this.getEarnedBadges(playerId);
    let totalQTime = 0;
    this.playerQnAs.map((playerQn) => {
      if (playerQn.playerId === playerId) {
        totalQTime = totalQTime + playerQn.playerAnswerInSeconds;
      }
    });
    stat.avgAnsTime = Math.floor((totalQTime) / this.playerQnAs.filter((p) => p.playerId === playerId).length);
    stat.consecutiveCorrectAnswers = (consecutiveCorrectAnswers === 3) ? 0 : consecutiveCorrectAnswers;
    this.stats[playerId] = stat;

  }

  decideWinner() {
    const playerId_0 = this.playerIds[0];
    if (Number(this.gameOptions.playerMode) === PlayerMode.Opponent && this.playerIds.length > 1) {
      if (this.round < 16) {
        const playerId_1 = this.playerIds[1];
        const player_0_score = this.gameOptions.isBadgeWithCategory ? this.stats[playerId_0].badge.length :  this.stats[playerId_0].score;
        const player_1_score = this.gameOptions.isBadgeWithCategory ? this.stats[playerId_1].badge.length :  this.stats[playerId_1].score;
        if ((player_0_score > player_1_score)) {
          this.winnerPlayerId = playerId_0;
        } else if ((player_0_score < player_1_score)) {
          this.winnerPlayerId = playerId_1;
        }
      }
    } else {
      const player_0_score = this.gameOptions.isBadgeWithCategory ? this.stats[playerId_0].badge.length : this.stats[playerId_0].score;
      if (player_0_score >= 5) {
        this.winnerPlayerId = playerId_0;
      }
    }
  }

  getEarnedBadges(playerId: string) {
    return this.playerQnAs.map(data => data.badge &&
      data.badge.won && data.playerId ===  playerId ?  data.badge.name : '').filter(data => data !== '');
  }

  decideNextTurn(playerQnA: PlayerQnA, userId: string) {
    if (Number(this.gameOptions.playerMode) === PlayerMode.Opponent) {
      const otherPlayerUserId = this.playerIds.filter(playerId => playerId !== userId)[0];
      let consecutiveCorrectAnswers = (this.stats[userId].consecutiveCorrectAnswers) ? this.stats[userId].consecutiveCorrectAnswers : 0;
      if (this.gameOptions.isBadgeWithCategory) {
        consecutiveCorrectAnswers = (!playerQnA.answerCorrect) ? 0 : (playerQnA.badge ? (consecutiveCorrectAnswers + 1) : consecutiveCorrectAnswers);
      } else {
        consecutiveCorrectAnswers = (!playerQnA.answerCorrect) ? 0 : consecutiveCorrectAnswers + 1;
      }


      if (Number(this.gameOptions.opponentType) === OpponentType.Random) {
        if (this.GameStatus === GameStatus.STARTED && (!playerQnA.answerCorrect || consecutiveCorrectAnswers === 3)) {
          this.nextTurnPlayerId = '';
          this.GameStatus = GameStatus.AVAILABLE_FOR_OPPONENT;
        } else if (this.GameStatus === GameStatus.RESTARTED && (!playerQnA.answerCorrect || consecutiveCorrectAnswers === 3)) {
          this.nextTurnPlayerId = otherPlayerUserId;
          this.GameStatus = GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE;
        } else if (this.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE) {
          this.GameStatus = GameStatus.WAITING_FOR_NEXT_Q;
          if (!playerQnA.answerCorrect) {
            this.nextTurnPlayerId = otherPlayerUserId;
          }
        } else if (
          (this.GameStatus === GameStatus.JOINED_GAME ||
            this.GameStatus === GameStatus.WAITING_FOR_NEXT_Q)
          && !playerQnA.answerCorrect) {
          this.nextTurnPlayerId = otherPlayerUserId;
          this.GameStatus = GameStatus.WAITING_FOR_NEXT_Q;
        } else if (!playerQnA.answerCorrect) {
          this.nextTurnPlayerId = otherPlayerUserId;
        } else {
          this.nextTurnPlayerId = userId;
        }
      } else if (Number(this.gameOptions.opponentType) === OpponentType.Friend) {
        if (this.GameStatus === GameStatus.STARTED && (!playerQnA.answerCorrect || consecutiveCorrectAnswers === 3)) {
          this.nextTurnPlayerId = otherPlayerUserId;
          this.GameStatus = GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE;
        } else if (this.GameStatus === GameStatus.RESTARTED && (!playerQnA.answerCorrect || consecutiveCorrectAnswers === 3)) {
          this.nextTurnPlayerId = otherPlayerUserId;
          this.GameStatus = GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE;
        } else if (this.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE) {
          this.GameStatus = GameStatus.WAITING_FOR_NEXT_Q;
          if (!playerQnA.answerCorrect) {
            this.nextTurnPlayerId = otherPlayerUserId;
          }
        } else if (
          (this.GameStatus === GameStatus.WAITING_FOR_NEXT_Q)
          && !playerQnA.answerCorrect) {
          this.nextTurnPlayerId = otherPlayerUserId;
          this.GameStatus = GameStatus.WAITING_FOR_NEXT_Q;
        } else if (!playerQnA.answerCorrect) {
          this.nextTurnPlayerId = otherPlayerUserId;
        } else {
          this.nextTurnPlayerId = userId;
        }
      }
      this.stats[userId].consecutiveCorrectAnswers = consecutiveCorrectAnswers;

    } else {
      this.nextTurnPlayerId = userId;
    }

  }


  updatePlayerQnA(playerId: string, questionId: string,
    playerAnswerId: string, playerAnswerInSeconds: number, answerCorrect: boolean): PlayerQnA {
    const playerQnA: PlayerQnA = this.playerQnAs.find(p => p.playerId === playerId && questionId === questionId);
    playerQnA.playerAnswerId = playerAnswerId;
    playerQnA.answerCorrect = answerCorrect;
    playerQnA.playerAnswerInSeconds = playerAnswerInSeconds;
    return playerQnA;
  }

  getDbModel(): any {
    const dbModel = {
      'gameOptions': { ...this._gameOptions },
      'playerIds': this.playerIds,
      'gameOver': (this.gameOver) ? this.gameOver : false,
      'playerQnAs': this.playerQnAs,
      'nextTurnPlayerId': (this.nextTurnPlayerId) ? this.nextTurnPlayerId : '',
      'GameStatus': (this.GameStatus) ? this.GameStatus : GameStatus.STARTED,
      'round': this.round,
      'reminder32Min': this.reminder32Min,
      'reminder8Hr': this.reminder8Hr
    };

    if (this.winnerPlayerId) {
      dbModel['winnerPlayerId'] = this.winnerPlayerId;
    }
    for (let i = 0; i < this.playerIds.length; i++) {
      dbModel['playerId_' + i] = this.playerIds[i];
    }

    if (this.createdAt) {
      dbModel['createdAt'] = this.createdAt;
    }

    if (this.turnAt) {
      dbModel['turnAt'] = this.turnAt;
    }

    if (this.reminder32Min) {
      dbModel['reminder32Min'] = this.reminder32Min;
    }

    if (this.reminder8Hr) {
      dbModel['reminder8Hr'] = this.reminder8Hr;
    }

    if (this.gameOverAt) {
      dbModel['gameOverAt'] = this.gameOverAt;
    }

    if (this.gameId) {
      dbModel['id'] = this.gameId;
    }

    for (const key of Object.keys(this.stats)) {
      this.stats[key] = { ...this.stats[key] };
    }

    dbModel['stats'] = this.stats;

    return dbModel;
  }

  static getViewModel(dbModel: any): Game {

    const game: Game = new Game(dbModel['gameOptions'], dbModel['playerIds'][0], dbModel['id'],
      dbModel['playerQnAs'], dbModel['gameOver'], dbModel['nextTurnPlayerId'],
      (dbModel['playerIds'].length > 1) ? dbModel['playerIds'][1] : undefined, dbModel['winnerPlayerId'],
      dbModel['GameStatus'], dbModel['createdAt'], dbModel['turnAt'],dbModel['gameOverAt'],  dbModel['round'], dbModel['reminder32Min'],
      dbModel['reminder8Hr']);
    if (dbModel['playerIds'].length > 1) {
      game.addPlayer(dbModel['playerIds'][1]);  //2 players
    }
    game.setStat(dbModel['stats']);
    // console.log(game);
    return game;
  }


}
