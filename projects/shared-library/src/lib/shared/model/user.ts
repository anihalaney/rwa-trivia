import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

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
  profileSetting?: string;
  profileLocationSetting?: string;
  privateProfileSetting?: boolean;
  profilePicture?: String;
  email: string;
  idToken?: string;
  authState: firebase.User;
  roles?: any;
  tags?: string[];
  isSubscribed?: boolean;
  profilePictureUrl?: string;
  stats?: UserStats;
  isRequestedBulkUpload: boolean;

  constructor(authState?: firebase.User) {
    if (authState) {
      this.authState = authState;
      this.userId = authState.uid;
      this.email = authState.providerData[0].email;
      if (authState.providerData[0].displayName) {
        this.displayName = authState.providerData[0].displayName
      } else {
        this.displayName = this.email.split('@')[0] + new Date().getTime();
      }

    }
  }

}

export class UserStats {
  leaderBoardStats?: { [key: number]: number }
  gamePlayed?: number;
  categories?: number;
  wins?: number;
  badges?: number;
  losses?: number;
  avgAnsTime?: number;
  contribution?: number;
  constructor() {
    this.leaderBoardStats = {};
  }
}

export class LeaderBoardUser {
  userId: string;
  score: number;
}
