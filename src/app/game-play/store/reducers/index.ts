import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { Game, Question } from '../../../model';
import { currentGame, newGameId, currentGameQuestion, updateGame } from './game-play.reducer';

export * from './game-play.reducer';

export interface GamePlayState {
  currentGame: Game;
  newGameId: string;
  currentGameQuestion: Question,
  updateGame: any
}

export const reducer: ActionReducerMap<GamePlayState> = {
  currentGame: currentGame,
  newGameId: newGameId,
  currentGameQuestion: currentGameQuestion,
  updateGame: updateGame
};

export const gameplayState = createFeatureSelector<GamePlayState>('gameplay');
