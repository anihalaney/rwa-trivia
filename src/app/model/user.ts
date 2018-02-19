import * as firebase from 'firebase/app';

export class User {
  id?: string;
  userId: string;
  name?: string;
  displayName: string;
  location?: string;
  categoryIds?: number[];
  facebookUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  profileSetting: string;
  profileLocationSetting: string;
  privateProfileSetting: boolean;
  email: string;
  idToken?: string;
  authState: firebase.User;
  roles: any;

  constructor(authState: firebase.User) {
    if (authState) {
      this.authState = authState;
      this.userId = authState.uid;
      this.email = authState.providerData[0].email;
      this.displayName = (authState.providerData[0].displayName ? authState.providerData[0].displayName : this.email);
    }
  }
}
