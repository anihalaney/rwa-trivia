import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { switchMap, map, } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';

import { User } from '../../../model';
import { BulkActions, BulkActionTypes } from '../actions';
import * as useractions from '../actions/bulk.actions';
import { UserService } from '../../../core/services';

@Injectable()
export class UserEffects {
    constructor(
        private actions$: Actions,
        private svc: UserService
    ) { }

    @Effect()
    addUser$ = this.actions$
        .ofType(UserActionTypes.LOAD_BULK_UPLOAD)
        .pipe(
        switchMap((action: useractions.AddUserProfile) => {
            this.svc.saveUserProfile(action.payload.user);
            return empty();
        })
        );

    @Effect()
    loadUserProfile$ = this.actions$
        .ofType(UserActionTypes.LOAD_USER_PROFILE)
        .pipe(
        switchMap((action: useractions.LoadUserProfile) =>
            this.svc.getUserProfile(action.payload.user).pipe(
                map((user: User) => new useractions.LoadUserProfileSuccess(user))
            )
        )
        );
}
