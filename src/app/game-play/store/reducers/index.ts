import { ActionReducerMap, createSelector } from '@ngrx/store';

import { Game, Question } from '../../../model';
import { currentGame, newGameId, currentGameQuestion } from './game-play.reducer';

export * from './game-play.reducer';

export interface GamePlayState {
  currentGame: Game;
  newGameId: string;
  currentGameQuestion: Question
}

export const reducer: ActionReducerMap<GamePlayState> = {
  currentGame: currentGame,
  newGameId: newGameId,
  currentGameQuestion: currentGameQuestion
};

