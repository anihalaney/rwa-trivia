import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Game, PlayerQnA, GameOptions, User, Question } from '../../../shared/model';
import { ActionWithPayload, GameActions } from '../actions';
import { GameService } from '../../services';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class GameEffects {
  @Effect()
  UserReaction$ = this.actions$
    .pipe(ofType(GameActions.USER_REACTION))
    .pipe(
      switchMap((action: ActionWithPayload<{ questionId: string, userId: string, status: string }>) =>
        this.svc.userReaction(action.payload.questionId, action.payload.userId, action.payload.status).pipe(
          map(() => this.gameActions.UpdateUserReactionSuccess())
        )
      )
    );

  @Effect()
  GetQuestion$ = this.actions$
    .pipe(ofType(GameActions.GET_QUESTION))
    .pipe(
      switchMap((action: ActionWithPayload<string>) =>
        this.svc.getQuestion(action.payload).pipe(
          map((question: Question) => this.gameActions.GetQuestionSuccess(question))
        )
      )
    );

  @Effect()
  getUserReaction$ = this.actions$
    .pipe(ofType(GameActions.GET_USER_REACTION))
    .pipe(
      switchMap((action: ActionWithPayload<{ questionId: string, userId: string }>) =>
        this.svc.getUserReaction(action.payload.questionId, action.payload.userId).pipe(
          map((reaction: { status: string }) => this.gameActions.GetUserReactionSuccess(reaction))
        )
      )
    );

  @Effect()
  getActiveGames$ = this.actions$
    .pipe(ofType(GameActions.GET_ACTIVE_GAMES))
    .pipe(
      map((action: ActionWithPayload<User>) => action.payload),
      switchMap((payload: User) => this.svc.getActiveGames(payload)),
      map((games: Game[]) => this.gameActions.getActiveGamesSuccess(games))
    );

  @Effect()
  UpdateQuestionStat$ = this.actions$
    .pipe(ofType(GameActions.UPDATE_QUESTION_STAT))
    .pipe(
      switchMap((action: ActionWithPayload<{ questionId: string, type: string }>) =>
        this.svc.updateQuestionStat(action.payload.questionId, action.payload.type).pipe(
          map(() => this.gameActions.UpdateQuestionStatSuccess())
        ))
    );

  constructor(
    private actions$: Actions,
    private gameActions: GameActions,
    private svc: GameService
  ) { }
}
