import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { Game, Question } from 'shared-library/shared/model';
import {
  currentGame, currentGameQuestion, updateGame, userAnsweredQuestion,
  saveReportQuestion
} from './game-play.reducer';

export * from './game-play.reducer';

export interface GamePlayState {
  currentGame: Game;
  currentGameQuestion: Question;
  updateGame: any;
  userAnsweredQuestion: any;
  saveReportQuestion: string;
}

export const reducer: ActionReducerMap<GamePlayState> = {
  currentGame: currentGame,
  currentGameQuestion: currentGameQuestion,
  updateGame: updateGame,
  userAnsweredQuestion: userAnsweredQuestion,
  saveReportQuestion: saveReportQuestion
};

export const gamePlayState = createFeatureSelector<GamePlayState>('gameplay');
