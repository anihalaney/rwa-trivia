import { Observable, Subscription, empty } from 'rxjs';
import { take, switchMap, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as gameplayactions from '../../store/actions';
import { GameActions, UserActions } from 'shared-library/core/store/actions/index';
import { Category, GameOptions, User, ApplicationSettings, PlayerMode } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class NewGame implements OnDestroy {
  categoriesObs: Observable<Category[]>;
  categories: Category[];
  tagsObs: Observable<string[]>;
  tags: string[];
  userDict$: Observable<{ [key: string]: User }>;
  selectedTags: string[];
  applicationSettings: ApplicationSettings;
  gameOptions: GameOptions;
  subscriptions = [];
  showUncheckedCategories: Boolean = false;
  allCategoriesSelected: Boolean = true;
  uFriends: Array<string>;
  userDict: { [key: string]: User } = {};
  noFriendsStatus: boolean;
  user: User;
  friendUserId: string;
  errMsg: string;
  life: number;
  gameErrorMsg: String = 'Sorry, don\'t have enough life.';

  constructor(
    public store: Store<AppState>,
    public utils: Utils,
    public gameActions: GameActions,
    public userActions: UserActions,
    public cd: ChangeDetectorRef,
    public route: ActivatedRoute) {
    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories), take(1));
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));
    this.selectedTags = [];
    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => { this.userDict = userDict; this.cd.markForCheck(); }));
    this.subscriptions.push(this.categoriesObs.subscribe(categories => { this.categories = categories; this.cd.markForCheck(); }));
    this.subscriptions.push(this.tagsObs.subscribe(tags => this.tags = tags));
    let challengerUserId = '';
    this.subscriptions.push(this.route.params.pipe(map(data => challengerUserId = data.userid),
      switchMap(() => this.store.select(appState.coreState).pipe(select(s => s.user)))).subscribe(user => {
        if (user) {
          this.user = user;
          if (this.user.tags && this.user.tags.length > 0) {
            this.selectedTags = this.user.tags;
          } else if (this.user.lastGamePlayOption && this.user.lastGamePlayOption.tags.length > 0) {
            this.selectedTags = this.user.lastGamePlayOption.tags;
          }
          if (!challengerUserId) {
            this.store.dispatch(this.userActions.loadUserFriends(user.userId));
          }
        }
      }));

    this.subscriptions.push(
      this.route.params.pipe(map(data => data),
        switchMap((data) => {
          if (!data.userid) {
            return this.store.select(appState.coreState).pipe(select(s => s.userFriends));
          } else {
            return empty();
          }
        })).subscribe((uFriends: any) => {
          if (uFriends) {
            this.uFriends = [];
            uFriends.map(friend => {
              if (this.userDict && !this.userDict[friend.userId]) {
                this.store.dispatch(this.userActions.loadOtherUserProfile(friend.userId));
              }
              this.uFriends = [...this.uFriends, ...friend.userId];
            });
            this.noFriendsStatus = false;
          } else {
            this.noFriendsStatus = true;
          }
          this.cd.markForCheck();
        }));
    this.store.dispatch(this.gameActions.resetNewGame());
    this.store.dispatch(new gameplayactions.ResetCurrentGame());
    this.gameOptions = new GameOptions();

  }


  filter(val: string): string[] {
    return this.tags.filter(option => new RegExp(this.utils.regExpEscape(`${val}`), 'gi').test(option));
  }


  startNewGame(gameOptions: GameOptions) {
    let user: User;
    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => user = s.user)); // logged in user
    if (this.gameOptions.playerMode === PlayerMode.Opponent) {
      gameOptions.friendId = this.friendUserId;
    }
    console.log('gameOptions', gameOptions);
    this.store.dispatch(new gameplayactions.CreateNewGame({ gameOptions: gameOptions, user: user }));
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 70, 60, '70X60');
  }

  removeEnteredTag(tag) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
  }

  destroy() {
    this.userDict = {};
    this.categories = [];
    this.tags = [];
    this.selectedTags = [];
    this.uFriends = [];
    this.tagsObs = undefined;
    this.applicationSettings = undefined;
    this.gameOptions = undefined;
    this.noFriendsStatus = undefined;
    this.user = undefined;
    this.friendUserId = undefined;
    this.errMsg = undefined;
    this.life = undefined;
  }

  selectFriendId(friendId: string) {
    this.friendUserId = friendId;
    this.errMsg = undefined;
  }

  ngOnDestroy() {

  }
}
