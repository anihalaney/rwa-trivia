import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { Game, Question } from 'shared-library/shared/model';
import {
  currentGame, newGameId, currentGameQuestion, updateGame, gameInvites, userAnsweredQuestion,
  saveReportQuestion
} from './game-play.reducer';

export * from './game-play.reducer';

export interface GamePlayState {
  currentGame: Game;
  newGameId: string;
  currentGameQuestion: Question;
  updateGame: any;
  gameInvites: Game[];
  userAnsweredQuestion: any;
  saveReportQuestion: string;
}

export const reducer: ActionReducerMap<GamePlayState> = {
  currentGame: currentGame,
  newGameId: newGameId,
  currentGameQuestion: currentGameQuestion,
  updateGame: updateGame,
  gameInvites: gameInvites,
  userAnsweredQuestion: userAnsweredQuestion,
  saveReportQuestion: saveReportQuestion
};

export const gamePlayState = createFeatureSelector<GamePlayState>('gameplay');
