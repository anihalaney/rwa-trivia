export class GameOptions {
  playerMode: PlayerMode;
  opponentType?: OpponentType;
  gameMode: GameMode;
  categoryIds: number[];
  tags: string[];
  maxQuestions: number;

  constructor() {
    //defaults
    this.playerMode = PlayerMode.Single;
    this.gameMode = GameMode.Normal;
    this.categoryIds = [];
    this.tags = [];
    this.maxQuestions = 4;
  }
}
export enum PlayerMode {
  Single,
  Opponent
}
export enum OpponentType {
  Computer,
  Random,
  Friend
}
export enum GameMode {
  Normal,
  Offline
}