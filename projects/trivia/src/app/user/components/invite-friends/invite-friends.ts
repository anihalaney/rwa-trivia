import { OnDestroy, ChangeDetectorRef } from '@angular/core';
import { userCardType } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { UserActions } from 'shared-library/core/store/actions';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class InviteFriends implements OnDestroy {

  uFriends: Array<any>;

  subscriptions = [];
  userCardType = userCardType;

  defaultAvatar = 'assets/images/default-avatar.png';

  constructor(public store: Store<AppState>, public userActions: UserActions,
    public cd: ChangeDetectorRef) {
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      if (user) {
        this.store.dispatch(this.userActions.loadUserFriends(user.userId));
      }
    }));
    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.userFriends)).subscribe((uFriends: any) => {
      if (uFriends !== null && uFriends !== undefined) {
        this.uFriends = [...uFriends];
      }
    }));
  }


  ngOnDestroy() {

  }

}
