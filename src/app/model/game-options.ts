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
  Random,
  Friend,
  Computer
}
export enum GameMode {
  Normal,
  Offline
}

export enum GameStatus {
  STARTED = 'started',
  WAITING_FOR_NEXT_Q = 'waiting for next question',
  COMPLETED = 'completed'
}


export enum GameOperations {
  CALCULATE_SCORE = 'calculate_score',
  GAME_OVER = 'game_over'
}
