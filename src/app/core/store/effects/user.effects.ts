import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../app-store';
import { ActionWithPayload, UserActions } from '../actions';
import { User } from '../../../model';
import { UserService } from '../../services'

@Injectable()
export class UserEffects {

    @Effect()
    loadUserRoles$ = this.actions$
        .ofType(UserActions.LOGIN_SUCCESS)
        .map((action: ActionWithPayload<User>) => action.payload)
        .switchMap((user: User) => this.svc.getUserRoles(user))
        .map((user: User) => this.userActions.addUserWithRoles(user));

    @Effect()
    addUserProfile$ = this.actions$
        .ofType(UserActions.ADD_USER_PROFILE)
        .do((action: ActionWithPayload<User>) => this.svc.saveUserProfile(action.payload))
        .filter(() => false);

    @Effect()
    loadUserProfile$ = this.actions$
        .ofType(UserActions.LOAD_USER_PROFILE)
        .switchMap((action: ActionWithPayload<User>) => this.svc.getUserProfile(action.payload))
        .map((user: User) => this.userActions.loadUserProfileSuccess(user));

    constructor(
        private actions$: Actions,
        private userActions: UserActions,
        private svc: UserService
    ) { }
}
