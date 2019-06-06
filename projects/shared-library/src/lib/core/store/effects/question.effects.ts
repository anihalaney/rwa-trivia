import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { empty, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { Question, RouterStateUrl } from '../../../shared/model';
import { QuestionService } from '../../services';
import { ActionWithPayload, QuestionActions } from '../actions';

@Injectable()
export class QuestionEffects {


    // Load question of day based on url
    @Effect()
    // handle location update
    loadRouteQuestionOfDay$ = this.actions$
        .pipe(ofType(ROUTER_NAVIGATION))
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/dashboard')))
        .pipe(
            switchMap(() => this.svc.getQuestionOfTheDay(false)
                .pipe(
                    map((question: Question) => this.questionActions.getQuestionOfTheDaySuccess(question))
                    , catchError(err => of(this.questionActions.getQuestionOfTheDayError(err))))));


    @Effect()
    // handle location update
    loadNextQuestionOfDay$ = this.actions$
        .pipe(ofType(QuestionActions.GET_QUESTION_OF_THE_DAY))
        .pipe(
            switchMap((action) =>
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
            switchMap((action: ActionWithPayload<Question>) => {
                this.svc.saveQuestion(action.payload);
                return empty();
            }
            )
        );

    constructor(
        private actions$: Actions,
        private questionActions: QuestionActions,
        private svc: QuestionService
    ) { }
}
