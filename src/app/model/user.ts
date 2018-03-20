import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

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
  profilePicture?: String;
  email: string;
  idToken?: string;
  authState: firebase.User;
  roles: any;
  tags?: string[];
  profileUrl?: Observable<any>;

  constructor(authState: firebase.User) {
    if (authState) {
      this.authState = authState;
      this.userId = authState.uid;
      this.email = authState.providerData[0].email;
      this.displayName = (authState.providerData[0].displayName ? authState.providerData[0].displayName : this.email);
    }
  }

  setUserDetail(user: any) {
    this.name = user.name;
    this.location = user.location;


  }

}
