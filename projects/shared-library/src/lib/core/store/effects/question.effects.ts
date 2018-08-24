import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Question, RouterStateUrl } from '../../../shared/model';
import { QuestionActions } from '../actions';
import { QuestionService } from '../../services'
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class QuestionEffects {


    // Load question of day based on url
    @Effect()
    // handle location update
    loadRouteQuestionOfDay$ = this.actions$
        .ofType('ROUTER_NAVIGATION')
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
        .ofType(QuestionActions.GET_QUESTION_OF_THE_DAY)
        .pipe(
            switchMap((action) =>
                this.svc.getQuestionOfTheDay(true)
                    .pipe(
                        map((question: Question) => this.questionActions.getQuestionOfTheDaySuccess(question)),
                        catchError(err => of(this.questionActions.getQuestionOfTheDayError(err)))
                    )
            ));

    constructor(
        private actions$: Actions,
        private questionActions: QuestionActions,
        private svc: QuestionService
    ) { }
}
