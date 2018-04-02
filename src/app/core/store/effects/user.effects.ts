import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { ActionWithPayload, UserActions } from '../actions';
import { User, RouterStateUrl } from '../../../model';
import { UserService } from '../../services'
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class UserEffects {

    @Effect()
    loadUserRoles$ = this.actions$
        .ofType(UserActions.LOGIN_SUCCESS)
        .map((action: ActionWithPayload<User>) => action.payload)
        .switchMap((user: User) => this.svc.getUserRoles(user))
        .map((user: User) => this.userActions.addUserWithRoles(user));


    // Load users based on url
    @Effect()
    // handle location update
    loadRouteUsers$ = this.actions$
        .ofType('ROUTER_NAVIGATION')
        .map((action: any): RouterStateUrl => action.payload.routerState)
        .filter((routerState: RouterStateUrl) =>
            routerState.url.toLowerCase().startsWith('/'))
        .pipe(switchMap(() => this.svc.getUsers().pipe(
            map((users: User[]) =>
                this.userActions.loadUsersSuccess(users)
            )))
        );


    constructor(
        private actions$: Actions,
        private userActions: UserActions,
        private svc: UserService
    ) { }
}
