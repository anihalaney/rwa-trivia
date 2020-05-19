import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { select, Store } from '@ngrx/store';
import { UserActions } from 'shared-library/core/store';
import { userCardType } from 'shared-library/shared/model';
import { appState } from '../../../store';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invite-to-play',
  templateUrl: './invite-to-play.component.html',
  styleUrls: ['./invite-to-play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class InviteToPlayComponent implements OnChanges, OnDestroy {
  @Input() userId;
  userCardType = userCardType;
  subscriptions = [];
  uFriends = [];
  constructor(private store: Store<any>,
              private userAction: UserActions,
              public router: Router,
              private cd: ChangeDetectorRef) {
   }

  loadUserFriends() {
      this.store.dispatch(this.userAction.loadUserFriends(this.userId));
      this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.userFriends)).subscribe((uFriends: any) => {
        if (uFriends !== null && uFriends !== undefined) {
          this.uFriends = [];
          uFriends.map((friend, index) => {
            this.store.dispatch(this.userAction.loadOtherUserProfile(friend.userId));
            this.uFriends.push(friend);
            this.uFriends[index].userId = friend.userId;
            this.cd.markForCheck();
          });
        }
      }));
  }

  startNewGame(type: string, userId?: string) {
    if (type === 'friend') {
      this.router.navigate(['/game-play/play-game-with-friend/', userId]);
    } else if (type === 'random') {
      this.router.navigate(['/game-play/play-game-with-random-user']);
    }
  }
  ngOnChanges() {
      if ( this.userId ) {
        this.loadUserFriends();
      }
  }

  ngOnDestroy() {

  }

}
