export class GameOptions {
  playerMode: PlayerMode;
  opponentType?: OpponentType;
  gameMode: GameMode;
  categoryIds: number[];
  tags: string[];
  maxQuestions: number;
  friendId?: string;
  rematch?: boolean;

  constructor() {
    //defaults
    this.playerMode = PlayerMode.Single;
    this.gameMode = GameMode.Normal;
    this.categoryIds = [];
    this.tags = [];
    this.maxQuestions = 8;
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
  RESTARTED = 'restarted',
  AVAILABLE_FOR_OPPONENT = 'available for opponent',
  WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE = 'waiting for friend invitation acceptance',
  WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE = 'waiting for random player invitation acceptance',
  JOINED_GAME = 'joined opponent',
  WAITING_FOR_NEXT_Q = 'waiting for next question',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  INVITATION_TIMEOUT = 'invitation timeout'
}


export enum GameOperations {
  CALCULATE_SCORE = 'calculate_score',
  GAME_OVER = 'game_over',
  REPORT_STATUS = 'report_status',
  UPDATE_ROUND = 'update_round',
  REJECT_GAME = 'reject game'
}
