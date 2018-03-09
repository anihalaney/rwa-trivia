import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Question, RouterStateUrl } from '../../../model';
import { ActionWithPayload, QuestionActions } from '../actions';
import { QuestionService } from '../../services'


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
        .pipe(() => this.svc.getQuestionOfTheDay())
        .map((question: Question) => this.questionActions.getQuestionOfTheDaySuccess(question)
        );

    constructor(
        private actions$: Actions,
        private questionActions: QuestionActions,
        private svc: QuestionService
    ) { }
}
