import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, filter, take, mergeMap } from 'rxjs/operators';
import { empty } from 'rxjs';
import { QuestionService } from 'shared-library/core/services';
import { Question, RouterStateUrl } from 'shared-library/shared/model';
import { UserActionTypes } from '../actions';
import * as userActions from '../actions/user.actions';
import { AppState } from '../../../store';
import { coreState } from 'shared-library/core/store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

@Injectable()
export class UserEffects {

    // Load User Published Question by userId from router
    @Effect()
    loadUserPublishedRouteQuestions$ = this.actions$
        .pipe(ofType(ROUTER_NAVIGATION))
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/user/my/questions')),
            mergeMap((routerState: RouterStateUrl) =>
                this.store.select(coreState).pipe(
                    map(s => s.user),
                    filter(u => !!u),
                    take(1),
                    map(user => user.userId))
            ))
        .pipe(
            switchMap((id: string) => {
                return this.questionService.getUserQuestions(id, true).pipe(map((questions: Question[]) =>
                    new userActions.LoadUserPublishedQuestionsSuccess(questions)
                ));
            })
        );

    // Load User UnPublished Question by userId from router
    @Effect()
    loadUserUnpublishedQuestions$ = this.actions$
        .pipe(ofType(ROUTER_NAVIGATION))
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/user/my/questions')),
            mergeMap((routerState: RouterStateUrl) =>
                this.store.select(coreState).pipe(
                    map(s => s.user),
                    filter(u => !!u),
                    take(1),
                    map(user => user.userId))
            ))
        .pipe(
            switchMap((id: string) => {
                return this.questionService.getUserQuestions(id, false).pipe(map((questions: Question[]) =>
                    new userActions.LoadUserUnpublishedQuestionsSuccess(questions)
                ));
            })
        );


    // Add Question
    @Effect()
    addQuestion$ = this.actions$
        .pipe(ofType(UserActionTypes.ADD_QUESTION))
        .pipe(
            switchMap((action: userActions.AddQuestion) => {
                return this.questionService.saveQuestion(action.payload.question);
            })
        );

    constructor(
        private actions$: Actions,
        private questionService: QuestionService,
        private store: Store<AppState>,
    ) {

    }
}
