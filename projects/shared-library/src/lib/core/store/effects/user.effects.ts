import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { ActionWithPayload, UserActions } from '../actions';
import { User, RouterStateUrl } from '../../../shared/model';
import { UserService } from '../../services'
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


    constructor(
        private actions$: Actions,
        private userActions: UserActions,
        private svc: UserService
    ) { }
}
