import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ActionWithPayload, UserActions } from '../actions';
import { User, RouterStateUrl, Game, Friends, Invitation, Account } from '../../../shared/model';
import { UserService } from '../../services';
import { switchMap, map, distinct, mergeMap, filter, take } from 'rxjs/operators';
import { empty } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../trivia/src/app/store';
import { coreState } from '../reducers';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';


@Injectable()
export class UserEffects {

    // Load users based on url
    @Effect()
    loadUserProfile$ = this.actions$
        .pipe(ofType(UserActions.LOGIN_SUCCESS))
        .pipe(map((action: ActionWithPayload<User>) => action.payload),
            switchMap((user: User) => this.svc.loadUserProfile(user)),
            map((user: User) => this.userActions.addUserWithRoles(user)));


    // Load users based on url
    @Effect()
    loadUserAccounts$ = this.actions$
        .pipe(ofType(UserActions.LOGIN_SUCCESS))
        .pipe(map((action: ActionWithPayload<User>) => action.payload),
            switchMap((account: User) => this.svc.loadAccounts(account)),
            map((account: Account) => this.userActions.loadAccountsSuccess(account)));


    @Effect()
    // handle location update
    loadOtherUserProfile$ = this.actions$
        .pipe(ofType(UserActions.LOAD_OTHER_USER_PROFILE))
        .pipe(map((action: ActionWithPayload<string>) => action.payload),
            distinct(),
            mergeMap((userId: string) => this.svc.loadOtherUserProfile(userId)),
            map((user: User) => this.userActions.loadOtherUserProfileSuccess(user)));


    // Update User
    @Effect()
    UpdateUser$ = this.actions$
        .pipe(ofType(UserActions.UPDATE_USER))
        .pipe(
            switchMap((action: ActionWithPayload<User>) => {
                this.svc.updateUser(action.payload);
                return empty();
            }
            )
        );

    // load invited games
    @Effect()
    // handle location update
    loadGameInvites$ = this.actions$
        .pipe(ofType(UserActions.LOAD_GAME_INVITES))
        .pipe(
            switchMap((action: ActionWithPayload<User>) =>
                this.svc.getGameInvites(action.payload).pipe(
                    map((games: Game[]) => this.userActions.loadGameInvitesSuccess(games))
                )
            )
        );

    @Effect()
    rejectGameInvitation$ = this.actions$
        .pipe(ofType(UserActions.REJECT_GAME_INVITATION))
        .pipe(
            switchMap((action: ActionWithPayload<string>) =>
                this.svc.rejectGameInvitation(action.payload)
                    .pipe(
                        map((msg: any) => this.userActions.updateGameSuccess()))
            ));

    // Get User list
    @Effect()
    LoadUserFriends$ = this.actions$
        .pipe(ofType(UserActions.LOAD_USER_FRIENDS))
        .pipe(
            switchMap((action: ActionWithPayload<string>) =>
                this.svc.loadUserFriends(action.payload)
                    .pipe(map((friends: Friends) => this.userActions.loadUserFriendsSuccess(friends)))
            )
        );

    // Load Friend Invitations
    @Effect()
    loadFriendInvitations$ = this.actions$
        .pipe(ofType(ROUTER_NAVIGATION))
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/dashboard')),
            mergeMap((routerState: RouterStateUrl) =>
                this.store.select(coreState).pipe(
                    map(s => s.user),
                    filter(u => !!u),
                    take(1),
                    map(user => user.email))
            ))
        .pipe(
            switchMap((email: string) => {
                return this.svc.loadFriendInvitations(email).pipe(map((invitations: Invitation[]) =>
                    this.userActions.loadUserInvitationsSuccess(invitations)
                ));
            })
        );

    // Update Invitation
    @Effect()
    UpdateInvitation$ = this.actions$
        .pipe(ofType(UserActions.UPDATE_INVITATION))
        .pipe(
            switchMap((action: ActionWithPayload<Invitation>) => {
                this.svc.setInvitation(action.payload);
                return empty();
            }
            )
        );

    @Effect()
    makeFriend$ = this.actions$
        .pipe(ofType(UserActions.MAKE_FRIEND))
        .pipe(
            switchMap((action: ActionWithPayload<string>) =>
                this.svc.checkInvitationToken(action.payload).pipe(
                    map((friend: any) => this.userActions.storeInvitationToken('NONE'))
                ).pipe(map(() => this.userActions.makeFriendSuccess()))
            ));

    @Effect()
    saveInvitation$ = this.actions$
        .pipe(ofType(UserActions.ADD_USER_INVITATION))
        .pipe(
            switchMap((action: ActionWithPayload<string>) =>
                this.svc.saveUserInvitations(action.payload).pipe(
                    map((statusMessages: any) => this.userActions.addUserInvitationSuccess(statusMessages['messages']))
                )
            )
        );

    // Save user profile
    @Effect()
    addUser$ = this.actions$
        .pipe(ofType(UserActions.ADD_USER_PROFILE))
        .pipe(
            switchMap((action: ActionWithPayload<User>) => {
                return this.svc.saveUserProfile(action.payload).pipe(
                    map((status: any) => this.userActions.addUserProfileSuccess())
                );
            })
        );
 // Add User lives
 @Effect()
    AddUserLives$ = this.actions$
     .pipe(ofType(UserActions.ADD_USER_LIVES))
     .pipe(
         switchMap((action: ActionWithPayload<string>) => {
             return this.svc.addUserLives(action.payload).pipe(
                 map(() => this.userActions.addUserLivesSuccess()));
         }
         )
     );

    constructor(
        private actions$: Actions,
        private userActions: UserActions,
        private svc: UserService,
        private store: Store<AppState>,
    ) { }
}
