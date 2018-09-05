import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, filter, take, mergeMap } from 'rxjs/operators';
import { empty } from 'rxjs';

import { UserService, QuestionService, GameService } from '../../../../../../shared-library/src/lib/core/services';
import { Question, RouterStateUrl, Friends, Game } from '../../../../../../shared-library/src/lib/shared/model';
import { UserActionTypes } from '../actions';
import * as userActions from '../actions/user.actions';
import { AppState } from '../../../store';
import { UserActions, coreState } from '../../../../../../shared-library/src/lib/core/store';


@Injectable()
export class UserEffects {
    // Save user profile
    @Effect()
    addUser$ = this.actions$
        .ofType(UserActionTypes.ADD_USER_PROFILE)
        .pipe(
            switchMap((action: userActions.AddUserProfile) => {
                return this.userService.saveUserProfile(action.payload.user).pipe(
                    map((status: any) => new userActions.AddUserProfileSuccess())
                )
            })
        );

    // Load User Published Question by userId from router
    @Effect()
    loadUserPublishedRouteQuestions$ = this.actions$
        .ofType('ROUTER_NAVIGATION')
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/my/questions')),
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
        .ofType('ROUTER_NAVIGATION')
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/my/questions')),
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
                ).pipe(map(() => new userActions.MakeFriendSuccess()))
            ));

    // Get Game list
    @Effect()
    getGameResult$ = this.actions$
        .ofType(UserActionTypes.GET_GAME_RESULT)
        .pipe(
            switchMap((action: userActions.GetGameResult) =>
                this.gameService.getGameResult(action.payload.userId)
                    .pipe(map((games: Game[]) => new userActions.GetGameResultSuccess(games)))
            )
        );

    // Get Game list
    @Effect()
    LoadUserFriends$ = this.actions$
        .ofType(UserActionTypes.LOAD_USER_FRIENDS)
        .pipe(
            switchMap((action: userActions.LoadUserFriends) =>
                this.userService.loadUserFriends(action.payload.userId)
                    .pipe(map((friends: Friends) => new userActions.LoadUserFriendsSuccess(friends)))
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

    }
}
