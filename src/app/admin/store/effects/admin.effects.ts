import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import { SearchResults, Question, RouterStateUrl, SearchCriteria } from '../../../model';
import { AdminActions, AdminActionTypes } from '../actions';
import * as adminActions from '../actions/admin.actions';
import { QuestionService } from '../../../core/services';

@Injectable()
export class AdminEffects {


    // Load User Published Question by userId from router
    @Effect()
    // handle location update
    loadRouteQuestions$ = this.actions$
        .ofType('ROUTER_NAVIGATION')
        .map((action: any): RouterStateUrl => action.payload.routerState)
        .filter((routerState: RouterStateUrl) =>
            routerState.url.toLowerCase().startsWith('/admin'))
        .pipe(
        switchMap((routerState: RouterStateUrl) =>
            this.svc.getQuestions(0, 25, new SearchCriteria()).pipe(
                map((results: SearchResults) => new adminActions.LoadQuestionsSuccess(results))
            )
        )
        );

    // Load User Published Question by userId from router
    @Effect()
    // handle location update
    loadUnpublishedRouteQuestions$ = this.actions$
        .ofType('ROUTER_NAVIGATION')
        .map((action: any): RouterStateUrl => action.payload.routerState)
        .filter((routerState: RouterStateUrl) =>
            routerState.url.toLowerCase().startsWith('/admin')
        )
        .pipe(
        switchMap((routerState: RouterStateUrl) =>
            this.svc.getUnpublishedQuestions(routerState.url.toLowerCase().includes('bulk-question')).pipe(
                map((questions: Question[]) => new adminActions.LoadUnpublishedQuestionsSuccess(questions))
            )
        )
        );

    // Load Question As per Search critearea
    @Effect()
    loadQuestions$ = this.actions$
        .ofType(AdminActionTypes.LOAD_QUESTIONS)
        .pipe(
        switchMap((action: adminActions.LoadQuestions) =>
            this.svc.getQuestions(action.payload.startRow, action.payload.pageSize, action.payload.criteria).pipe(
                map((results: SearchResults) => new adminActions.LoadQuestionsSuccess(results))
            )
        )
        );

    // Load All Unpublished Question
    @Effect()
    loadUnpublishedQuestions$ = this.actions$
        .ofType(AdminActionTypes.LOAD_UNPUBLISHED_QUESTIONS)
        .pipe(
        switchMap((action: adminActions.LoadUnpublishedQuestions) =>
            this.svc.getUnpublishedQuestions(action.payload.question_flag).pipe(
                map((questions: Question[]) => new adminActions.LoadUnpublishedQuestionsSuccess(questions))
            )
        )
        );

    // Approve Question
    @Effect()
    approveQuestion$ = this.actions$
        .ofType(AdminActionTypes.APPROVE_QUESTION)
        .pipe(
        switchMap((action: adminActions.ApproveQuestion) => {
            this.svc.approveQuestion(action.payload.question);
            return empty();
        })
        );

    constructor(
        private actions$: Actions,
        private svc: QuestionService,
    ) { }

}