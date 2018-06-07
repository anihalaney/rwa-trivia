import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Question, RouterStateUrl } from '../../../model';
import { ActionWithPayload, QuestionActions } from '../actions';
import { QuestionService } from '../../services'
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class QuestionEffects {


    // Load question of day based on url
    @Effect()
    // handle location update
    loadRouteQuestionOfDay$ = this.actions$
        .ofType('ROUTER_NAVIGATION')
        .map((action: any): RouterStateUrl => action.payload.routerState)
        .filter((routerState: RouterStateUrl) =>
            routerState.url.toLowerCase().startsWith('/dashboard'))
        .pipe(() => this.svc.getQuestionOfTheDay(false))
        .map((question: Question) => this.questionActions.getQuestionOfTheDaySuccess(question)
        );


    @Effect()
    // handle location update
    loadNextQuestionOfDay$ = this.actions$
        .ofType(QuestionActions.GET_QUESTION_OF_THE_DAY)
        .pipe(
        switchMap((action) =>
            this.svc.getQuestionOfTheDay(true)
                .pipe(
                map((question: Question) => this.questionActions.getQuestionOfTheDaySuccess(question))
                )
        )
        );

    constructor(
        private actions$: Actions,
        private questionActions: QuestionActions,
        private svc: QuestionService
    ) { }
}
