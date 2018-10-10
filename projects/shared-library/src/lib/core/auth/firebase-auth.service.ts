import { Injectable } from '@angular/core';

@Injectable()
export abstract class FirebaseAuthService {

    constructor() {

    }

    public createUserWithEmailAndPassword(email, password) {

    }

    public authState(): any {
        return '';
    }

    public getIdToken(user, forceRefresh: boolean): any {
        return '';
    }

    public refreshToken(forceRefresh: boolean) {

    }

    public signOut() {

    }
    public showLogin() {

    }
}