import { Component, Input, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, categoryDictionary } from '../../../store';
import { Observable, Subscription } from 'rxjs';

import { Category, User, LeaderBoardUser } from '../../../../../../shared-library/src/public_api';
import { leaderBoardState } from '../../store';
import { UserActions } from '../../../core/store/actions';
import * as leaderBoardActions from '../../store/actions';
import { Utils } from '../../../core/services';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
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
    private userActions: UserActions) {
    this.categoryDict$ = store.select(categoryDictionary);
    this.categoryDict$.subscribe(categoryDict => {
      this.categoryDict = categoryDict;
    });

    this.store.dispatch(new leaderBoardActions.LoadLeaderBoard());

    this.store.select(leaderBoardState).pipe(select(s => s.scoreBoard)).subscribe(lbsStat => {

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
    });
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
