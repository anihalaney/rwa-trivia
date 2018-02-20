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
    addUserProfileData$ = this.actions$
        .ofType(UserActions.ADD_USER_PROFILE_DATA)
        .do((action: ActionWithPayload<User>) => this.svc.saveUserProfileData(action.payload))
        .filter(() => false);

    @Effect()
    loadUserById$ = this.actions$
        .ofType(UserActions.LOAD_USER_BY_ID)
        .switchMap((action: ActionWithPayload<User>) => this.svc.getUserById(action.payload))
        .map((user: User) => this.userActions.loadUserByIdSuccess(user));

    constructor(
        private actions$: Actions,
        private userActions: UserActions,
        private svc: UserService
    ) { }
}
