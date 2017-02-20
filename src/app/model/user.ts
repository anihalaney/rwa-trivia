import { AuthProviders, FirebaseAuthState } from 'angularfire2';

export class User {
  userId: string;
  displayName: string;
  email: string;
  authState: FirebaseAuthState;

  constructor(authState: FirebaseAuthState) 
  {
    if (authState) {
      this.authState = authState;
      this.userId = authState.uid;
      this.displayName = authState.auth.providerData[0].displayName;
      this.email = authState.auth.providerData[0].email;
    }
  }
}
