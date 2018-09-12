import { Injectable, Inject, NgZone } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { User } from './../../shared/model';
// import { isNativeScript, Tracking } from '@sketchpoints/utils';

// import { UserActions } from '../state';
// import { LogService } from './log.service';
// import { WindowService } from './window.service';
// import { PlatformFirebaseToken } from './tokens';
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

    public listenForChanges(
        name: string,
        queryParams?: Array<{ name: string; comparator: string; value: any }>
    ): Observable<any> {
        // must implement in platform specific service
        return of(0);
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
        console.log('payload > ', payload);
        this._ngZone.run(() => {
            //   this._store.dispatch(new UserActions.Login(payload));
            console.log('payload > ', payload);
            this._store.dispatch(this.userActions.loginSuccess(payload));
        });
    }

    public logout() {
        // must implement in platform specific service
    }

    public upload(localPath: string, remotePath: string) {
        return new Promise((resolve, reject) => { });
    }

    public download(remotePath: string, localPath: any) {
        return new Promise((resolve, reject) => { });
    }
}
