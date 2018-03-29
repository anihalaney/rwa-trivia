import { GameOptions, GameStatus } from './game-options';
import { Question } from './question';

export class PlayerQnA {
  playerId: string;
  questionId: string;
  playerAnswerId?: string;
  playerAnswerInSeconds?: number;
  answerCorrect?: boolean;
}
export class Game {
  private _gameId?: string;
  private _gameOptions: GameOptions
  private _playerIds: string[];
  public gameOver: boolean;
  public playerQnAs: PlayerQnA[];
  public nextTurnPlayerId: string;
  public winnerPlayerId: string;
  public GameStatus: string;
  public createdAt: number;
  public turnAt: number;

  constructor(gameOptions: GameOptions, player1UUId: string, gameId?: string, playerQnAs?: any, gameOver?: boolean,
    nextTurnPlayerId?: string, player2UUId?: string, winnerPlayerId?: string, gameStatus?: string, createdAt?: number, turnAt?: number) {
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
        let qna = playerQnAs[key];
        this.playerQnAs.push({
          'playerId': qna.playerId,
          'questionId': qna.questionId,
          'playerAnswerId': qna.playerAnswerId,
          'playerAnswerInSeconds': qna.playerAnswerInSeconds,
          'answerCorrect': qna.answerCorrect
        });
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

  }

  addPlayer(playerUUId: string) {
    (this._playerIds.indexOf(playerUUId) === -1) ? this._playerIds.push(playerUUId) : '';
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
    let playerQnA: PlayerQnA = {
      'playerId': playerId,
      'questionId': questionId
    }
    this.playerQnAs.push(playerQnA);
    return playerQnA;
  }

  updatePlayerQnA(playerId: string, questionId: string,
    playerAnswerId: string, playerAnswerInSeconds: number, answerCorrect: boolean): PlayerQnA {
    let playerQnA: PlayerQnA = this.playerQnAs.find(p => p.playerId === playerId && questionId === questionId);
    playerQnA.playerAnswerId = playerAnswerId;
    playerQnA.answerCorrect = answerCorrect;
    playerQnA.playerAnswerInSeconds = playerAnswerInSeconds;
    return playerQnA;
  }

  getDbModel(): any {
    let dbModel = {
      'gameOptions': Object.assign({}, this.gameOptions),
      'playerIds': this.playerIds,
      'gameOver': (this.gameOver) ? this.gameOver : false,
      'playerQnAs': this.playerQnAs,
      'nextTurnPlayerId': (this.nextTurnPlayerId) ? this.nextTurnPlayerId : '',
      'GameStatus': (this.GameStatus) ? this.GameStatus : GameStatus.STARTED
    }
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

    if (this.gameId) {
      dbModel['id'] = this.gameId;
    }

    return dbModel;
  }

  static getViewModel(dbModel: any): Game {

    let game: Game = new Game(dbModel['gameOptions'], dbModel['playerIds'][0], dbModel['id'],
      dbModel['playerQnAs'], dbModel['gameOver'], dbModel['nextTurnPlayerId'],
      (dbModel['playerIds'].length > 1) ? dbModel['playerIds'][1] : undefined, dbModel['winnerPlayerId'],
      dbModel['GameStatus'], dbModel['createdAt'], dbModel['turnAt']);
    if (dbModel['playerIds'].length > 1) {
      game.addPlayer(dbModel['playerIds'][1]);  //2 players
    }
    //console.log(game);
    return game;
  }

}
