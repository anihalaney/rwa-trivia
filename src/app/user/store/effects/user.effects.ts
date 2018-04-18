import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

import { User, Question, RouterStateUrl, Friends, Game } from '../../../model';
import { UserActionTypes } from '../actions';
import * as userActions from '../actions/user.actions';
import { UserService, QuestionService, GameService } from '../../../core/services';
import { UserActions } from '../../../../app/core/store/actions';
import { Observable } from 'rxjs/Observable';

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

    // Load User Published Question by userId from router
    @Effect()
    // handle location update
    loadUserPublishedRouteQuestions$ = this.actions$
        .ofType('ROUTER_NAVIGATION')
        .map((action: any): RouterStateUrl => action.payload.routerState)
        .filter((routerState: RouterStateUrl) =>
            routerState.url.toLowerCase().startsWith('/my/questions') &&
            routerState.params.userid
        )
        .pipe(
        switchMap((routerState: RouterStateUrl) =>
            this.questionService.getUserQuestions(routerState.params.userid, true).pipe(
                map((questions: Question[]) =>
                    new userActions.LoadUserPublishedQuestionsSuccess(questions)
                )
            )
        )
        );

    // Load User Unpublished Question by userId from router
    @Effect()
    // handle location update
    loadUserUnpublishedRouteQuestions$ = this.actions$
        .ofType('ROUTER_NAVIGATION')
        .map((action: any): RouterStateUrl => action.payload.routerState)
        .filter((routerState: RouterStateUrl) =>
            routerState.url.toLowerCase().startsWith('/my/questions') &&
            routerState.params.userid
        )
        .pipe(
        switchMap((routerState: RouterStateUrl) =>
            this.questionService.getUserQuestions(routerState.params.userid, false).pipe(
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

    constructor(
        private actions$: Actions,
        private userService: UserService,
        private questionService: QuestionService,
        private userAction: UserActions,
        private gameService: GameService
    ) { }
}
