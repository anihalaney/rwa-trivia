import { ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { Utils } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary, getCategories } from '../../../store';
import { dashboardState } from '../../store';
import * as leaderBoardActions from '../../store/actions';
import { UserActions } from 'shared-library/core/store/actions';
import {
  Category, LeaderBoardConstants, LeaderBoardUser, LeaderBoardStats, User, Invitation
} from 'shared-library/shared/model';



@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class Leaderboard implements OnDestroy {

  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User };
  leaderBoardStatDict: { [key: string]: Array<LeaderBoardUser> } = {};
  leaderBoardStatDictArray: LeaderBoardStats[] = [];
  leaderBoardCat: Array<string>;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  lbsSliceStartIndex: number = -1;
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
  subscriptions = [];
  loggedInUserId: string;
  categoryDictList: Category[] = [];
  public selectedCatList = [];
  user: User;

  constructor(protected store: Store<AppState>,
    protected userActions: UserActions,
    protected utils: Utils,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    protected ngZone: NgZone,
  ) {

    this.route.params.subscribe((params) => {
      this.category = params['category'];
    });
    this.loggedInUserId = '';

    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
      console.log(this.userDict);
    }));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {

      if (user && user.userId) {
        this.loggedInUserId = user.userId;
        this.store.dispatch(new leaderBoardActions.LoadLeaderBoard());
      } else {
        this.store.dispatch(new leaderBoardActions.LoadLeaderBoard());
      }
    }));

    this.maxLeaderBoardDisplay = 10;
    this.categoryDict$ = this.store.select(categoryDictionary);

    this.subscriptions.push(this.store.select(getCategories).subscribe(categoryDictList => {
      this.categoryDictList = categoryDictList;
    }));


    this.subscriptions.push(this.categoryDict$.subscribe(categoryDict => {
      this.categoryDict = categoryDict;
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(dashboardState).pipe(select(s => s.scoreBoard)).subscribe(lbsStat => {
      if (lbsStat) {

        this.leaderBoardStatDictArray = lbsStat;
        this.leaderBoardCat = this.leaderBoardStatDictArray.map(leaderBoard => leaderBoard.id);

        this.leaderBoardStatDictArray.filter((leaderBoardStatDict) => {
          this.leaderBoardStatDict[leaderBoardStatDict.id] = leaderBoardStatDict.users;
        });

        if (this.leaderBoardCat && this.leaderBoardCat.length > 0) {
          this.leaderBoardCat.map((cat) => {
            if (Array.isArray(this.leaderBoardStatDict[cat])) {
              this.leaderBoardStatDict[cat].map((user: LeaderBoardUser) => {
                const userId = user.userId;
                if (this.userDict && !this.userDict[userId]) {
                  // console.log('dispatced other profile');
                  this.store.dispatch(this.userActions.loadOtherUserProfile(userId));
                }
                // console.log('info called', (!this.userDict[userId] || !this.userDict[userId].account && this.loggedInUserId));
                // console.log(this.userDict);
                // console.log(this.userDict[userId].account);
                // console.log(this.loggedInUserId);
                if (!this.userDict[userId] || !this.userDict[userId].account && this.loggedInUserId) {
                  // console.log('dispatced other loadOtherUserExtendedInfo', this.userDict[userId]);
                  this.store.dispatch(this.userActions.loadOtherUserExtendedInfo(userId));
                }
              });
            }
          });
          if (this.lbsSliceStartIndex === -1) {
            this.lbsSliceStartIndex = Math.floor((Math.random() * (this.leaderBoardCat.length - 3)) + 1);
            this.lbsSliceLastIndex = this.lbsSliceStartIndex + 3;
            this.lbsUsersSliceStartIndex = 0;
            this.lbsUsersSliceLastIndex = 3;
          }

          this.selectedCatList = this.leaderBoardStatDict[1];
        }
      }
      this.cd.markForCheck();
    }));

  }

  displayMore(): void {
    this.lbsUsersSliceLastIndex = this.lbsUsersSliceLastIndex + 7;
    this.cd.markForCheck();
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 44, 40, '44X40');
  }

  ngOnDestroy() {

  }
}
