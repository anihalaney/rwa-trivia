import { OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User, userCardType } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserActions } from 'shared-library/core/store/actions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class InviteFriends implements OnDestroy {

  uFriends: Array<any>;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  subscriptions = [];
  userCardType = userCardType;

  defaultAvatar = 'assets/images/default-avatar.png';

  constructor(public store: Store<AppState>, public userActions: UserActions, public utils: Utils,
    public cd: ChangeDetectorRef) {
    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => { this.userDict = userDict;
       if ( Object.entries(userDict).length !== 0) { this.cd.markForCheck(); }  }));
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      if (user) {
        this.store.dispatch(this.userActions.loadUserFriends(user.userId));
      }
    }));
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.userFriends)).subscribe((uFriends: any) => {
      if (uFriends !== null && uFriends !== undefined) {
        this.uFriends = [];
        uFriends.map((friend, index) => {
          this.store.dispatch(this.userActions.loadOtherUserProfile(friend.userId));
          this.uFriends.push(friend);
          this.uFriends[index].userId = friend.userId;
        });
      }
    }));
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 44, 40, '44X40');
  }

  ngOnDestroy() {

  }

}
