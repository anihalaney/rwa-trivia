import { Observable } from 'rxjs';


export abstract class FirebaseAuthService {
    abstract createUserWithEmailAndPassword(email, password);
    abstract authState(): Observable<any>;
    abstract signOut();
    abstract showLogin();
    abstract getIdToken(user, forceRefresh: boolean);
    abstract refreshToken(forceRefresh: boolean): Promise<string>;
    abstract signInWithEmailAndPassword(email: string, password: string);
    abstract sendEmailVerification(user): Promise<any>;
    abstract sendPasswordResetEmail(email: string): Promise<any>;
    abstract firebaseAuth(): any;
    abstract googleLogin(): Promise<any>;
    abstract facebookLogin(): Promise<any>;
    abstract phoneLogin(phoneNumber): Promise<any>;
    abstract twitterLogin(): Promise<any>;
    abstract githubLogin(): Promise<any>;
    abstract resumeState(user);
}
