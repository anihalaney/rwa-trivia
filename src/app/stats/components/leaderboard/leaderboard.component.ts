import { Component, Input, OnDestroy } from '@angular/core';
import * as statsActions from '../../../stats/store/actions';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { Category, User, LeaderBoardUser } from '../../../model';
import { Subscription } from 'rxjs/Subscription';
import { leaderBoardState } from '../../store';
import { concat } from 'rxjs/operator/concat';
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

  constructor(private store: Store<AppState>,
    private userActions: UserActions) {
    this.categoryDict$ = store.select(categoryDictionary);
    this.categoryDict$.subscribe(categoryDict => {
      this.categoryDict = categoryDict;
    });
    this.subs.push(store.select(appState.coreState).select(s => s.user).subscribe(user => {
      if (user) {
        this.store.dispatch(new leaderBoardActions.LoadLeaderBoard());
      }
    }));

    this.store.select(appState.leaderBoardState).select(s => s.scoreBoard).subscribe(lbsStat => {

      if (lbsStat !== null) {
        this.leaderBoardStatDict = lbsStat;
        this.leaderBoardCat = Object.keys(lbsStat);
        this.leaderBoardCat.map((cat) => {
          this.leaderBoardStatDict[cat].map((user: LeaderBoardUser) => {
            const userId = user.userId;
            if (this.userDict && !this.userDict[userId]) {
              this.store.dispatch(this.userActions.loadOtherUserProfile(userId));
            }
          })
        });
      }
      this.lbsSliceStartIndex = 0;
      this.lbsSliceLastIndex = 3;
    });
  }


  displayMore(): void {
    this.lbsSliceLastIndex = (this.leaderBoardCat.length > (this.lbsSliceLastIndex + 3)) ?
      this.lbsSliceLastIndex + 3 : this.leaderBoardCat.length;
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}
