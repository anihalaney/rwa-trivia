import { Component, Input, OnDestroy, ChangeDetectionStrategy, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';

import { Category, User, LeaderBoardUser, LeaderBoardConstants } from '../../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';
import { leaderBoardState } from '../../store';
import { UserActions } from '../../../../../../shared-library/src/lib/core/store/actions';
import * as leaderBoardActions from '../../store/actions';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent implements OnDestroy {

  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User };
  leaderBoardStatDict: { [key: string]: Array<LeaderBoardUser> };
  subs: Subscription[] = [];
  leaderBoardCat: Array<string>;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  lbsSliceStartIndex: number;
  lbsSliceLastIndex: number;
  lbsUsersSliceStartIndex: number;
  lbsUsersSliceLastIndex: number;
  maxLeaderBoardDisplay: number;
  platformIds: any;
  isbrowser: any;
  isServer: any;
  defaultAvatar = 'assets/images/default-avatar-small.png';
  unknown = LeaderBoardConstants.UNKNOWN;
  category: string;

  constructor(private store: Store<AppState>,
    private userActions: UserActions,
    private utils: Utils,
    public route: ActivatedRoute) {

    this.route.params.subscribe((params) => {
      this.category = params['category'];
    });
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));

    this.categoryDict$ = store.select(categoryDictionary);

    this.subs.push(this.categoryDict$.subscribe(categoryDict => {
      this.categoryDict = categoryDict;
    }));

    // if (isPlatformBrowser(this.platformId)) {
    this.store.dispatch(new leaderBoardActions.LoadLeaderBoard());
    // }
    this.maxLeaderBoardDisplay = 10;

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
            });
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
    return this.utils.getImageUrl(user, 44, 40, '44X40');
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }
}
