import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

import { User, Question } from '../../../model';
import { UserActions, UserActionTypes } from '../actions';
import * as userActions from '../actions/user.actions';
import { UserService, QuestionService } from '../../../core/services';

@Injectable()
export class UserEffects {
    constructor(
        private actions$: Actions,
        private userService: UserService,
        private questionService: QuestionService
    ) { }

    // Save user profile
    @Effect()
    addUser$ = this.actions$
        .ofType(UserActionTypes.ADD_USER_PROFILE)
        .pipe(
        switchMap((action: userActions.AddUserProfile) => {
            this.userService.saveUserProfile(action.payload.user);
            return empty();
        })
        );

    // Load User Profile By Id
    @Effect()
    loadUserProfile$ = this.actions$
        .ofType(UserActionTypes.LOAD_USER_PROFILE)
        .pipe(
        switchMap((action: userActions.LoadUserProfile) =>
            this.userService.getUserProfile(action.payload.user).pipe(
                map((user: User) => new userActions.LoadUserProfileSuccess(user))
            )
        )
        );

    // Load User Published Question by userId
    @Effect()
    loadUserPublishedQuestions$ = this.actions$
        .ofType(UserActionTypes.LOAD_USER_PUBLISHED_QUESTIONS)
        .pipe(
        switchMap((action: userActions.LoadUserPublishedQuestions) =>
            this.questionService.getUserQuestions(action.payload.user, true).pipe(
                map((questions: Question[]) => new userActions.LoadUserPublishedQuestionsSuccess(questions))
            )
        )
        );

    // Load User Unpublished Question by userId
    @Effect()
    loadUserUnpublishedQuestions$ = this.actions$
        .ofType(UserActionTypes.LOAD_USER_UNPUBLISHED_QUESTIONS)
        .pipe(
        switchMap((action: userActions.LoadUserUnpublishedQuestions) =>
            this.questionService.getUserQuestions(action.payload.user, false).pipe(
                map((questions: Question[]) => new userActions.LoadUserUnpublishedQuestionsSuccess(questions))
            )
        )
        );


    // Add Question
    @Effect()
    addQuestion$ = this.actions$
        .ofType(UserActionTypes.ADD_QUESTION)
        .pipe(
        switchMap((action: userActions.AddQuestion) => {
            this.questionService.saveQuestion(action.payload.question);
            return empty();
        })
        );

}
