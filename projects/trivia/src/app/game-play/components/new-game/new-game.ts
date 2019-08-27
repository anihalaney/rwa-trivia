import { Observable, Subscription, empty } from 'rxjs';
import { take, switchMap, map, flatMap, skipWhile } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as gameplayactions from '../../store/actions';
import { GameActions, UserActions } from 'shared-library/core/store/actions/index';
import { Category, GameOptions, User, ApplicationSettings, PlayerMode, OpponentType, userCardType } from 'shared-library/shared/model';
import { Utils, WindowRef } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



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
  loaderStatus = false;
  userCardType = userCardType;
  filteredCategories: Category[];
  selectedCategories: number[];

  constructor(
    public store: Store<AppState>,
    public utils: Utils,
    public gameActions: GameActions,
    public userActions: UserActions,
    public windowRef: WindowRef,
    public cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router) {
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


    this.store.select(appState.coreState).pipe(select(s => s.applicationSettings), take(1),
      map(appSettings => {
        if (appSettings) {
          this.applicationSettings = appSettings[0];
          if (this.applicationSettings && this.applicationSettings.lives.enable) {
            return appSettings;
          }
        }
      }),
      flatMap(() => this.store.select(appState.coreState).pipe(select(s => s.account),
        skipWhile(account => !account), take(1), map(account => this.life = account.lives)))).subscribe(data => {
          if (this.applicationSettings) {
            this.selectedCategories = [];
            let filteredCategories = [];
            if (this.applicationSettings && this.applicationSettings.game_play_categories) {
              filteredCategories = this.categories.filter((category) => {
                if (this.applicationSettings.game_play_categories.indexOf(Number(category.id)) > -1) {
                  return category;
                }
              });
            } else {
              filteredCategories = this.categories;
            }


            this.filteredCategories = [...filteredCategories.filter(c => c.requiredForGamePlay),
            ...filteredCategories.filter(c => !c.requiredForGamePlay)];


            this.filteredCategories.map(category => {
              category.isSelected = this.isCategorySelected(category.id, category.requiredForGamePlay);
              if (this.isCategorySelected(category.id, category.requiredForGamePlay)) {
                this.selectedCategories.push(category.id);
              }
            });
          }
          this.cd.markForCheck();
        });


    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.userFriends)).subscribe((uFriends: any) => {
      if (uFriends) {
        this.uFriends = [];
        uFriends.map(friend => {
          this.uFriends = [...this.uFriends, friend.userId];
        });
        this.noFriendsStatus = false;
      } else {
        this.noFriendsStatus = true;
      }
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.gameCreateStatus)).subscribe(gameCreateStatus => {
      if (gameCreateStatus) {
        this.redirectToDashboard(gameCreateStatus);
      }
      this.cd.markForCheck();
    }));


    this.store.dispatch(this.gameActions.resetNewGame());
    this.store.dispatch(new gameplayactions.ResetCurrentGame());
    this.gameOptions = new GameOptions();

  }

  isCategorySelected(categoryId: number, requiredForGamePlay: boolean) {
    if (requiredForGamePlay) {
      return true;
    }
    if (this.user.categoryIds && this.user.categoryIds.length > 0) {
      return this.user.categoryIds.includes(categoryId);
    } else if (this.user.lastGamePlayOption && this.user.lastGamePlayOption.categoryIds.length > 0) {
      return this.user.lastGamePlayOption.categoryIds.includes(categoryId);
    }
    return true;
  }


  filter(val: string): string[] {
    return this.tags.filter(option => new RegExp(this.utils.regExpEscape(`${val}`), 'gi').test(option));
  }

  validateGameOptions(isMobile: boolean, gameOptions: GameOptions) {
    if (Number(gameOptions.playerMode) === PlayerMode.Opponent && Number(gameOptions.opponentType) === OpponentType.Friend
      && !this.friendUserId) {
      if (!this.friendUserId) {
        this.errMsg = 'Please Select Friend';
        if (isMobile) {
          this.utils.showMessage('error', this.errMsg);
        } else {
          this.loaderStatus = false;
          if (this.windowRef && this.windowRef.nativeWindow && this.windowRef.nativeWindow.scrollTo) {
            this.windowRef.nativeWindow.scrollTo(0, 0);
          }
        }
        return;
      }
    }

    if (this.applicationSettings.lives.enable && this.life === 0) {
      this.redirectToDashboard(this.gameErrorMsg);
      return false;
    }
  }

  redirectToDashboard(msg) {
    this.router.navigate(['/dashboard']);
    this.utils.showMessage('success', msg);

  }

  startNewGame(gameOptions: GameOptions) {
    let user: User;
    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => {
      user = s.user;
      if (gameOptions.playerMode == 1) {
        gameOptions.friendId = this.friendUserId;
      }
      this.store.dispatch(new gameplayactions.CreateNewGame({ gameOptions: gameOptions, user: user }));
    })); // logged in user

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
    // console.log('event fired', friendId);
    this.friendUserId = friendId;
    this.errMsg = undefined;
  }

  ngOnDestroy() {

  }
}