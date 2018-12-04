import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { ActionWithPayload, UserActions } from '../actions';
import { User, RouterStateUrl, Game, Friends } from '../../../shared/model';
import { UserService } from '../../services';
import { switchMap, map, distinct, mergeMap } from 'rxjs/operators';

@Injectable()
export class UserEffects {

    // Load users based on url
    @Effect()
    loadUserProfile$ = this.actions$
        .ofType(UserActions.LOGIN_SUCCESS)
        .pipe(map((action: ActionWithPayload<User>) => action.payload),
            switchMap((user: User) => this.svc.loadUserProfile(user)),
            map((user: User) => this.userActions.addUserWithRoles(user)));


    @Effect()
    // handle location update
    loadOtherUserProfile$ = this.actions$
        .ofType(UserActions.LOAD_OTHER_USER_PROFILE)
        .pipe(map((action: ActionWithPayload<string>) => action.payload),
            distinct(),
            mergeMap((userId: string) => this.svc.loadOtherUserProfile(userId)),
            map((user: User) => this.userActions.loadOtherUserProfileSuccess(user)));

    //load invited games
    @Effect()
    // handle location update
    loadGameInvites$ = this.actions$
        .ofType(UserActions.LOAD_GAME_INVITES)
        .pipe(
            switchMap((action: ActionWithPayload<User>) =>
                this.svc.getGameInvites(action.payload).pipe(
                    map((games: Game[]) => this.userActions.loadGameInvitesSuccess(games))
                )
            )
        );

    @Effect()
    rejectGameInvitation$ = this.actions$
        .ofType(UserActions.REJECT_GAME_INVITATION)
        .pipe(
            switchMap((action: ActionWithPayload<string>) =>
                this.svc.rejectGameInvitation(action.payload)
                    .pipe(
                        map((msg: any) => this.userActions.updateGameSuccess()))
            ));

    // Get User list
    @Effect()
    LoadUserFriends$ = this.actions$
        .ofType(UserActions.LOAD_USER_FRIENDS)
        .pipe(
            switchMap((action: ActionWithPayload<string>) =>
                this.svc.loadUserFriends(action.payload)
                    .pipe(map((friends: Friends) => this.userActions.loadUserFriendsSuccess(friends)))
            )
        );

    constructor(
        private actions$: Actions,
        private userActions: UserActions,
        private svc: UserService
    ) { }
}
