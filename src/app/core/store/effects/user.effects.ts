import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { ActionWithPayload, UserActions } from '../actions';
import { User, RouterStateUrl } from '../../../model';
import { UserService } from '../../services'
import { switchMap, map } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

@Injectable()
export class UserEffects {

    // Load users based on url
    @Effect()
    loadUserProfile$ = this.actions$
        .ofType(UserActions.LOGIN_SUCCESS)
        .map((action: ActionWithPayload<User>) => action.payload)
        .switchMap((user: User) => this.svc.loadUserProfile(user))
        .map((user: User) => this.userActions.addUserWithRoles(user));


    @Effect()
    // handle location update
    loadUserInfo$ = this.actions$
        .ofType(UserActions.LOAD_USER_INFO)
        .map((action: ActionWithPayload<string>) => action.payload)
        .switchMap((userId: string) => this.svc.loadUserInfo(userId))
        .map((user: User) => this.userActions.loadUserInfoSuccess(user));


    constructor(
        private actions$: Actions,
        private userActions: UserActions,
        private svc: UserService
    ) { }
}
