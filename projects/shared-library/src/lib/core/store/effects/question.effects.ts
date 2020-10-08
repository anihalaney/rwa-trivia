import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Question, RouterStateUrl } from '../../../shared/model';
import { QuestionActions, UserActions, ActionWithPayload } from '../actions';
import { QuestionService } from '../../services';
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { of, empty } from 'rxjs';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

@Injectable()
export class QuestionEffects {
  // Load question of day based on url
  @Effect()
  // handle location update
  loadRouteQuestionOfDay$ = this.actions$
    .pipe(ofType(ROUTER_NAVIGATION))
    .pipe(
      map((action: any): RouterStateUrl => action.payload.routerState),
      filter((routerState: RouterStateUrl) => {
        return routerState.url === '/dashboard';
      })
    )
    .pipe(
      switchMap(() =>
        this.svc.getQuestionOfTheDay(false).pipe(
          map((question: Question) => this.questionActions.getQuestionOfTheDaySuccess(question)),
          catchError(err => of(this.questionActions.getQuestionOfTheDayError(err))))));

  @Effect()
  // handle location update
  loadNextQuestionOfDay$ = this.actions$
    .pipe(ofType(QuestionActions.GET_QUESTION_OF_THE_DAY))
    .pipe(
      switchMap(action =>
        this.svc.getQuestionOfTheDay(true)
          .pipe(
            map((question: Question) => this.questionActions.getQuestionOfTheDaySuccess(question)),
            catchError(err => of(this.questionActions.getQuestionOfTheDayError(err)))
          )
      ));

  // Update Question
  @Effect()
  updateQuestion$ = this.actions$
    .pipe(ofType(QuestionActions.UPDATE_QUESTION))
    .pipe(
      switchMap((action: ActionWithPayload<Question>): any => {
        return this.svc.saveQuestion(action.payload);
      })
    );

  // Load first question for specific route
  @Effect()
  // handle location update
  loadFirstQuestion$ = this.actions$
    .pipe(ofType(ROUTER_NAVIGATION))
    .pipe(
      map((action: any): RouterStateUrl => action.payload.routerState),
      filter((routerState: RouterStateUrl) =>
        routerState.url.toLowerCase().startsWith('/first-question')
      )
    )
    .pipe(
      switchMap(() => this.svc.getQuestionOfTheDay(true)

        .pipe(
          map((question: Question) => this.questionActions.getFirstQuestionSuccess(question)),
          catchError(err => of(this.questionActions.getFirstQuestionError(err))))));


  @Effect()
  // handle location update
  deleteQuestionImage$ = this.actions$
    .pipe(ofType(QuestionActions.DELETE_QUESTION_IMAGE))
    .pipe(
      switchMap((action: ActionWithPayload<string>) =>
        this.svc.deleteQuestionImage(action.payload)
          .pipe(
            map((res: any) => this.questionActions.deleteQuestionImageSuccess(res.message))
          )
      ));

  constructor(
    private actions$: Actions,
    private questionActions: QuestionActions,
    private svc: QuestionService
  ) { }
}
