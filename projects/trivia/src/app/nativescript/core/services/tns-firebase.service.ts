
import { Inject, NgZone } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PlatformFirebaseToken } from 'shared-library/core/db-service/tokens';
import { FirebaseService } from 'shared-library/core/db-service/firebase.service';
import { UserActions } from 'shared-library/core/store/actions';

export class TNSFirebaseService extends FirebaseService {

    constructor(
        protected _store: Store<any>,
        protected _ngZone: NgZone,
        public userAction: UserActions,
        @Inject(PlatformFirebaseToken) protected _firebase: any,
    ) {
        super(
            _store,
            _ngZone,
            userAction
        );
        this.loginTypes = {
            google: this._firebase.LoginType.GOOGLE,
            facebook: this._firebase.LoginType.FACEBOOK
        };
    }

    // all thats supported right now
    public googleConnect() {
        this._socialLogin({
            type: this.loginTypes.google
        });
    }

    public facebookConnect() {
        this._socialLogin({
            type: this.loginTypes.facebook,
            facebookOptions: {
            },
        });
    }

    private _socialLogin(options?: any) {
        super.socialLogin(options);
        this._firebase.logout().then(() => {
            // ensure any prior Firebase sessions are cleared
            // most often case if user logging out of one social account
            // and into another.
            this._firebase.login(options).then((result: any) => {
                if (result) {
                    this.getUserToken().then((token: string) => {
                        if (token) {
                            // social connect flow
                            this.connectToken(token, result);
                        } else {
                        }
                    }, (errorMessage: any) => {
                        console.log(`{N} Firebase plugin Auth token retrieval error: ${errorMessage}`);
                    });
                } else {
                    console.log('{N} Firebase login did not return a result.');
                }
            }, (errorMessage: any) => {
                console.log(errorMessage, 'console.log');
            });
        }, error => {

        });
    }

    public getUserToken(force: boolean = false): Promise<string> {
        return new Promise((resolve, reject) => {
            this._firebase.getAuthToken({
                forceRefresh: force,
            }).then((token: string) => {
                resolve(token);
            }, err => {
                reject(err);
            });
        });
    }

    public logout() {
        this._firebase.logout().then((result: any) => {
            this._store.dispatch(this.userAction.logoff());
        });
    }

    private _showAlert(
        message: string,
        title?: string,
    ): Promise<any> {
        return new Promise((resolve) => {
            const alertOptions: any = {
                message,
                okButtonText: 'ok',
            };
            if (title) {
                alertOptions.title = title;
            }
            // this._win.alert(<any>alertOptions).then(_ => resolve());
        });
    }

    private _listenSub: any;
    public listenForChanges(name: string, queryParams?: Array<{ name: string; comparator: string; value: any }>): Observable<any> {
        if (this._listenSub) {
            this._listenSub();
            this._listenSub = null;
        }
        let query = this._firebase.firestore.collection(name);
        if (queryParams) {
            for (const param of queryParams) {
                query = query.where(param.name, param.comparator, param.value);
            }
        }
        return Observable.create(observer => {
            this._listenSub = query.onSnapshot((snapshot: any) => {
                const results = [];
                if (snapshot && snapshot.forEach) {
                    snapshot.forEach(doc => results.push({
                        id: doc.id,
                        ...doc.data()
                    }));
                }
                observer.next(results);
            });
        });
    }

    public upload(localPath: string, remotePath: string) {
        return new Promise((resolve, reject) => {
            this._firebase.uploadFile({
                localFullPath: localPath,
                remoteFullPath: remotePath,
                onProgress: (status) => {
                    console.log(('Uploaded fraction: ' + status.fractionCompleted));
                    console.log('Percentage complete: ' + status.percentageCompleted);
                }
            }).then((file) => {
                // this._log.debug(JSON.stringify(file));
                resolve(file.url);
            }, err => {
                console.log('fileupload error:', err);
                reject(err);
            });
        });
    }

    public download(remotePath: string, localPath: any) {
        return new Promise((resolve, reject) => {
            this._firebase.downloadFile({
                remoteFullPath: remotePath,
                localFullPath: localPath,
                onProgress: (status) => {
                    console.log('Downloaded fraction: ' + status.fractionCompleted);
                    console.log('Download complete: ' + status.percentageCompleted);
                }
            }).then(file => {
                // this._log.debug(JSON.stringify(file));
                resolve(file);
            }, err => {
                console.log('file download error:', err);
                reject(err);
            });
        });
    }
}