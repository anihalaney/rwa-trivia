import { Component, Input, OnDestroy, ChangeDetectionStrategy, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';

import { Category, User, LeaderBoardUser } from '../../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { AppState, categoryDictionary } from '../../../store';
import { leaderBoardState } from '../../store';
import { UserActions } from '../../../../../../shared-library/src/lib/core/store/actions';
import * as leaderBoardActions from '../../store/actions';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent implements OnDestroy {
  @Input() userDict: { [key: string]: User };
  leaderBoardStatDict: { [key: string]: Array<LeaderBoardUser> };
  subs: Subscription[] = [];
  leaderBoardCat: Array<string>;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  lbsSliceStartIndex: number;
  lbsSliceLastIndex: number;
  lbsUsersSliceStartIndex: number;
  lbsUsersSliceLastIndex: number;

  defaultAvatar = 'assets/images/default-avatar-small.png';

  constructor(private store: Store<AppState>,
    private userActions: UserActions,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    this.categoryDict$ = store.select(categoryDictionary);
    this.subs.push(this.categoryDict$.subscribe(categoryDict => {
      this.categoryDict = categoryDict;
    }));

    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new leaderBoardActions.LoadLeaderBoard());
    }


    this.subs.push(this.store.select(leaderBoardState).pipe(select(s => s.scoreBoard)).subscribe(lbsStat => {

      if (lbsStat) {
        this.leaderBoardStatDict = lbsStat;
        this.leaderBoardCat = Object.keys(lbsStat);
        if (this.leaderBoardCat.length > 0) {
          this.leaderBoardCat.map((cat) => {
            this.leaderBoardStatDict[cat].map((user: LeaderBoardUser) => {
              const userId = user.userId;
              if (this.userDict && !this.userDict[userId]) {
                this.store.dispatch(this.userActions.loadOtherUserProfile(userId));
              }
            })
          });
          this.lbsSliceStartIndex = Math.floor((Math.random() * (this.leaderBoardCat.length - 3)) + 1);
          this.lbsSliceLastIndex = this.lbsSliceStartIndex + 3;
          this.lbsUsersSliceStartIndex = 0;
          this.lbsUsersSliceLastIndex = 3;
        }
      }
    }));
  }


  displayMore(): void {
    this.lbsUsersSliceLastIndex = this.lbsUsersSliceLastIndex + 7;
  }

  getImageUrl(user: User) {
    return Utils.getImageUrl(user, 44, 40, '44X40');
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}
