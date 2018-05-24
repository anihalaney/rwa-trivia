import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { switchMap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

import { User, Question, RouterStateUrl, Friends, Game } from '../../../model';
import { UserActionTypes } from '../actions';
import * as userActions from '../actions/user.actions';
import { UserService, QuestionService, GameService } from '../../../core/services';
import { UserActions } from '../../../../app/core/store/actions';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../store/app-store';
import { coreState } from '../../../core/store';

@Injectable()
export class UserEffects {


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

    // Load User Published Question by userId
    @Effect()
    // handle location update
    loadUserPublishedQuestions$ = this.actions$
        .ofType(UserActionTypes.LOAD_USER_PUBLISHED_QUESTIONS)
        .pipe(
        switchMap((action: userActions.LoadUserPublishedQuestions) =>
            this.questionService.getUserQuestions(action.payload.user.userId, true).pipe(
                map((questions: Question[]) =>
                    new userActions.LoadUserPublishedQuestionsSuccess(questions)
                )
            )
        )
        );

    // Load User Unpublished Question by userId
    @Effect()
    // handle location update
    loadUserUnpublishedQuestions$ = this.actions$
        .ofType(UserActionTypes.LOAD_USER_PUBLISHED_QUESTIONS)
        .pipe(
        switchMap((action: userActions.LoadUserUnpublishedQuestions) =>
            this.questionService.getUserQuestions(action.payload.user.userId, false).pipe(
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

    // Save user profile
    @Effect()
    saveInvitation$ = this.actions$
        .ofType(UserActionTypes.ADD_USER_INVITATION)
        .pipe(
        switchMap((action: userActions.AddUserInvitation) =>
            this.userService.saveUserInvitations(action.payload).pipe(
                map(() => new userActions.AddUserInvitationSuccess())
            )
        )
        );

    // Make friend
    @Effect()
    makeFriend$ = this.actions$
        .ofType(UserActionTypes.MAKE_FRIEND)
        .pipe(
        switchMap((action: userActions.MakeFriend) =>
            this.userService.checkInvitationToken(action.payload).pipe(
                map((friend: any) => this.userAction.storeInvitationToken(''))
            ).map(() => new userActions.MakeFriendSuccess())
        ));

    // Get Game list
    @Effect()
    getGameResult$ = this.actions$
        .ofType(UserActionTypes.GET_GAME_RESULT)
        .pipe(
        switchMap((action: userActions.GetGameResult) =>
            this.gameService.getGameResult(action.payload.userId)
                .map((games: Game[]) => new userActions.GetGameResultSuccess(games))
        )
        );

    // Get Game list
    @Effect()
    LoadUserFriends$ = this.actions$
        .ofType(UserActionTypes.LOAD_USER_FRIENDS)
        .pipe(
        switchMap((action: userActions.LoadUserFriends) =>
            this.userService.loadUserFriends(action.payload.userId)
                .map((friends: Friends) => new userActions.LoadUserFriendsSuccess(friends))
        )
        );


    constructor(
        private actions$: Actions,
        private userService: UserService,
        private questionService: QuestionService,
        private userAction: UserActions,
        private gameService: GameService,
        private store: Store<AppState>,
    ) {
        store.select(coreState).select(s => s.user).skip(1).subscribe(user => {
            if (user) {
                this.store.dispatch(new userActions.LoadUserPublishedQuestions({ 'user': user }))
                this.store.dispatch(new userActions.LoadUserUnpublishedQuestions({ 'user': user }))
            }
        });
    }
}
