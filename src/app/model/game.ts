import {GameOptions} from './game-options';
import {Question} from './question';

export class PlayerQnA {
  playerId: string;
  questionId: string;
  playerAnswerId: string;
  playerAnswerInSeconds: number;
  answerCorrect: boolean;
}

export class Game {
  private _gameId?: string;
  private _gameOptions: GameOptions
  private _playerIds: string[];
  private playerQnAs: PlayerQnA[];

  constructor(gameOptions: GameOptions, player1UUId: string, gameId?: string) {
    //defaults
    this._gameOptions = gameOptions;
    this._playerIds = [player1UUId];
    if (gameId)
      this._gameId = gameId;
  }

  addPlayer(playerUUId: string) {
    this._playerIds.push(playerUUId);
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

  getDbGameModel() {
    let dbModel = {
      "gameOptions": this.gameOptions,
      "playerIds": this.playerIds
    }
    return dbModel;
  }

  static getGameModel(dbModel: any): Game {
    console.log(dbModel);
    let game: Game = new Game(dbModel["gameOptions"], dbModel["playerIds"][0], dbModel["$key"]);
    console.log(game);
    return game;
  }

}
