import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { Game, Question } from 'shared-library/shared/model';
import {
  currentGame, currentGameQuestion, updateGame, userAnsweredQuestion,
  saveReportQuestion,
  updateUserReactionStatus,
  getUserReactionStatus,
  getQuestionSuccess
} from './game-play.reducer';

export * from './game-play.reducer';

export interface GamePlayState {
  currentGame: Game;
  currentGameQuestion: Question;
  updateGame: any;
  userAnsweredQuestion: any;
  saveReportQuestion: string;
  updateUserReactionStatus: any;
  getUserReactionStatus: any;
  getQuestionSuccess: any;
}

export const reducer: ActionReducerMap<GamePlayState> = {
  currentGame: currentGame,
  currentGameQuestion: currentGameQuestion,
  updateGame: updateGame,
  userAnsweredQuestion: userAnsweredQuestion,
  saveReportQuestion: saveReportQuestion,
  updateUserReactionStatus: updateUserReactionStatus,
  getUserReactionStatus: getUserReactionStatus,
  getQuestionSuccess: getQuestionSuccess
};

export const gamePlayState = createFeatureSelector<GamePlayState>('gameplay');
