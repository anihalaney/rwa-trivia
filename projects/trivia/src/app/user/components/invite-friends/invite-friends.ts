import { OnDestroy } from '@angular/core';
import { User } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { Store, select } from '@ngrx/store';
import * as useractions from '../../../user/store/actions';
import { Observable, Subscription } from 'rxjs';
import { UserActions } from 'shared-library/core/store/actions';

export class InviteFriends implements OnDestroy {

  uFriends: Array<any>;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  subs: Subscription[] = [];
  defaultAvatar = 'assets/images/default-avatar.png';

  constructor(public store: Store<AppState>, public userActions: UserActions, public utils: Utils) {
    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subs.push(this.userDict$.subscribe(userDict => { this.userDict = userDict; }));
    this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      if (user) {
        this.store.dispatch(this.userActions.loadUserFriends(user.userId));
      }
    }));
    this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.userFriends)).subscribe(uFriends => {
      if (uFriends !== null && uFriends !== undefined) {
        this.uFriends = [];
        uFriends.myFriends.map((friend, index) => {
          this.store.dispatch(this.userActions.loadOtherUserProfile(Object.keys(friend)[0]));
          this.uFriends.push(friend[Object.keys(friend)[0]]);
          this.uFriends[index].userId = Object.keys(friend)[0];
        });
      }
    }));
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 44, 40, '44X40');
  }
  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

}
