import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { AppStore } from '../app-store';
import { ActionWithPayload, UserActions } from '../actions';
import { User } from '../../../model';
import { AuthenticationService } from '../../services';
import {UserService} from '../../services';

@Injectable()
export class UserEffects {
    constructor (
        private actions$: Actions,
        private userActions: UserActions,
        private svc: AuthenticationService,
        private usvc: UserService
    ) {}

    @Effect()
    loadUserRoles$ = this.actions$
        .ofType(UserActions.LOGIN_SUCCESS)
        .map((action: ActionWithPayload<User>) => action.payload)
        .switchMap((user: User) => this.svc.getUserRoles(user))
        .map((user: User) => this.userActions.addUserWithRoles(user));

  @Effect()
  loadUsers$ = this.actions$
    .ofType(UserActions.LOAD_USERS)
    .switchMap(() => this.usvc.getUser())
    .map((users: User[]) => this.userActions.loadUsersSuccess(users));

  @Effect()
  updateUser$ = this.actions$
    .ofType(UserActions.UPDATE_USER)
    .do((action: ActionWithPayload<User>) => this.usvc.saveUser(action.payload))
    .filter(() => false);
}
