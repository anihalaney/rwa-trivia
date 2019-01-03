import { Injectable, Inject, NgZone } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { User } from './../../shared/model';
import { UserActions } from '../../core/store/actions';

export interface IFirebaseLoginTypes {
    google: any;
    facebook: any;
}
@Injectable()
export class FirebaseService {
    public loginTypes: IFirebaseLoginTypes;

    constructor(
        protected _store: Store<any>,
        protected _ngZone: NgZone,
        private userActions: UserActions
    ) { }

    public googleConnect() {
        // must implement in platform specific services
    }

    public facebookConnect() {
        // must implement in platform specific service
    }

    public getUserToken(): Promise<string> {
        // must implement in platform specific service
        return new Promise(resolve => resolve());
    }

    public socialLogin(options?: any) {
        const provider = options ? options.type : 'unknown';
    }

    public connectToken(token: string, user?: any) {
        // tmp handling for testing
        const payload: User = new User();
        if (user) {
            // first props come from web sdk, second props are from {N} sdk
            payload.displayName = user.displayName || user.name;
            payload.email = user.email;
            // payload.pic = user.photoURL || user.profileImageURL;
            payload.userId = user.uid;
        }
        this._ngZone.run(() => {
            this._store.dispatch(this.userActions.loginSuccess(payload));
        });
    }

    public logout() {
        // must implement in platform specific service
    }
}
