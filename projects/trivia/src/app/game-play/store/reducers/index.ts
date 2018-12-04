import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { Game, Question, Friends } from 'shared-library/shared/model';
import {
  currentGame, newGameId, currentGameQuestion, updateGame, userAnsweredQuestion,
  saveReportQuestion
} from './game-play.reducer';

export * from './game-play.reducer';

export interface GamePlayState {
  currentGame: Game;
  newGameId: string;
  currentGameQuestion: Question;
  updateGame: any;
  userAnsweredQuestion: any;
  saveReportQuestion: string;
}

export const reducer: ActionReducerMap<GamePlayState> = {
  currentGame: currentGame,
  newGameId: newGameId,
  currentGameQuestion: currentGameQuestion,
  updateGame: updateGame,
  userAnsweredQuestion: userAnsweredQuestion,
  saveReportQuestion: saveReportQuestion
};

export const gamePlayState = createFeatureSelector<GamePlayState>('gameplay');
