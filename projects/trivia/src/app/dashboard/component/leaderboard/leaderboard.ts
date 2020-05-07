import { ChangeDetectorRef, OnDestroy, NgZone } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Observable } from "rxjs";
import { Utils } from "shared-library/core/services";
import {
  AppState,
  appState,
  categoryDictionary,
  getCategories
} from "../../../store";
import { dashboardState } from "../../store";
import * as leaderBoardActions from "../../store/actions";
import { UserActions, TagActions, TopicActions } from "shared-library/core/store/actions";
import { getTopTopics } from "shared-library/core/store";
import {
  Category,
  LeaderBoardConstants,
  LeaderBoardUser,
  LeaderBoardStats,
  User,
  userCardType,
  Topic
} from "shared-library/shared/model";
import { switchMap, map } from "rxjs/operators";

@AutoUnsubscribe({ arrayName: "subscriptions" })
export class Leaderboard implements OnDestroy {
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User };
  leaderBoardStatDict: { [key: string]: Array<LeaderBoardUser> } = {};
  leaderBoardStatDictArray: LeaderBoardStats[] = [];
  leaderBoardCat: Array<string> = [];
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  topicDict:  Topic[] = [];
  lbsSliceStartIndex: number = -1;
  lbsSliceLastIndex: number;
  lbsUsersSliceStartIndex: number;
  lbsUsersSliceLastIndex: number;
  maxLeaderBoardDisplay: number;
  platformIds: any;
  isbrowser: any;
  isServer: any;
  defaultAvatar = "assets/images/default-avatar-small.png";
  unknown = LeaderBoardConstants.UNKNOWN;
  category: string;
  subscriptions = [];
  loggedInUserId: string;
  categoryDictList: Category[] = [];
  public selectedCatList = [];
  user: User;
  userCardType = userCardType;
  public items: Array<string>;

  constructor(
    protected store: Store<AppState>,
    protected userActions: UserActions,
    protected utils: Utils,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    protected ngZone: NgZone,
    protected tag: TagActions,
    protected topic: TopicActions
  ) {
    this.route.params.subscribe(params => {
      this.category = params["category"];
    });
    this.loggedInUserId = "";
    // this.store.dispatch(this.topic.loadTopTopics());
    this.userDict$ = this.store
      .select(appState.coreState)
      .pipe(select(s => s.userDict));
    this.subscriptions.push(
      this.userDict$.subscribe(userDict => {
        this.userDict = userDict;
        this.cd.markForCheck();
      })
    );

    this.subscriptions.push(
      this.store
        .select(appState.coreState)
        .pipe(select(s => s.user))
        .subscribe(user => {
          if (user && user.userId) {
            this.loggedInUserId = user.userId;
          }
        })
    );
    this.maxLeaderBoardDisplay = 10;
    this.categoryDict$ = this.store.select(categoryDictionary);
    this.subscriptions.push(
      this.store.select(getTopTopics).subscribe(categoryDictList => {
        categoryDictList.map((data: Topic) => {
         this.topicDict[data.id] = data;
        });
        this.categoryDictList = categoryDictList;
        this.store.dispatch(new leaderBoardActions.LoadLeaderBoard({data : categoryDictList}));
        this.cd.markForCheck();
      })
    );

    this.subscriptions.push(
      this.categoryDict$.subscribe(categoryDict => {
        this.categoryDict = categoryDict;
        this.cd.markForCheck();
      })
    );

    this.subscriptions.push(
      this.store
        .select(appState.coreState)
        .pipe(
          select(s => s.user),
          map(user => {
            if (user && user.userId) {
              this.loggedInUserId = user.userId;
            }
          })
        )
        .pipe(
          switchMap(() => {
            return this.store
              .select(dashboardState)
              .pipe(select(s => s.scoreBoard));
          })
        )
        .subscribe(lbsStat => {
          if (lbsStat  && Object.entries(this.categoryDict).length > 0) {
            this.leaderBoardStatDictArray = lbsStat;
            this.items = [];
            this.leaderBoardStatDictArray.map(
              leaderBoard => {
                if (leaderBoard.users.length > 0) {
                  this.leaderBoardCat.push(leaderBoard['type'] === 'category' ?  this.categoryDict[leaderBoard.id].categoryName :
                  (`${leaderBoard.id.charAt(0).toUpperCase()}${leaderBoard.id.slice(1)}`));
                }
                this.items.push(leaderBoard['type'] === 'category' ?  this.categoryDict[leaderBoard.id].categoryName :
                (`${leaderBoard.id.charAt(0).toUpperCase()}${leaderBoard.id.slice(1)}`));
              }
              );

            this.leaderBoardStatDictArray.filter(leaderBoardStatDict => {
              this.leaderBoardStatDict[leaderBoardStatDict['type'] === 'category' ?
              this.categoryDict[leaderBoardStatDict.id].categoryName :
              `${leaderBoardStatDict.id.charAt(0).toUpperCase()}${leaderBoardStatDict.id.slice(1)}`] =
                leaderBoardStatDict.users;
                this.cd.markForCheck();
            });

            if (this.leaderBoardCat && this.leaderBoardCat.length > 0) {
              if (this.lbsSliceStartIndex === -1) {
                this.lbsSliceStartIndex = Math.floor(
                  Math.random() * (this.leaderBoardCat.length - 3) + 1
                );
                this.lbsSliceLastIndex = this.lbsSliceStartIndex + 3;
                this.lbsUsersSliceStartIndex = 0;
                this.lbsUsersSliceLastIndex = 3;
              }
              this.selectedCatList = this.leaderBoardStatDict[this.items[0]];
              if (this.selectedCatList) {
                this.selectedCatList.map((data, index) => {
                  data.index = index;
                });
              }

              this.cd.markForCheck();
            }
          }
        })
    );
  }

  displayMore(): void {
    this.lbsUsersSliceLastIndex = this.lbsUsersSliceLastIndex + 7;
    this.cd.markForCheck();
  }

  ngOnDestroy() {}
}
