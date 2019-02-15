import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as gameplayactions from '../../store/actions';
import { GameActions, UserActions } from 'shared-library/core/store/actions/index';
import { Category, GameOptions, User, ApplicationSettings } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';

export class NewGame {
  categoriesObs: Observable<Category[]>;
  categories: Category[];
  tagsObs: Observable<string[]>;
  tags: string[];
  userDict$: Observable<{ [key: string]: User }>;
  selectedTags: string[];
  subs: Subscription[] = [];
  applicationSettings: ApplicationSettings;
  gameOptions: GameOptions;

  showUncheckedCategories: Boolean = false;
  allCategoriesSelected: Boolean = true;
  uFriends: Array<string>;
  userDict: { [key: string]: User } = {};
  noFriendsStatus: boolean;
  filteredTags$: Observable<string[]>;
  user: User;
  friendUserId: string;
  loaderStatus = false;
  errMsg: string;
  life: number;
  gameErrorMsg: String = 'Sorry, don\'t have enough life.';

  constructor(
    public store: Store<AppState>,
    public utils: Utils,
    public gameActions: GameActions,
    public userActions: UserActions) {
    this.categoriesObs = store.select(appState.coreState).pipe(select(s => s.categories));
    this.tagsObs = store.select(appState.coreState).pipe(select(s => s.tags));
    this.selectedTags = [];
    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.userDict$.subscribe(userDict => this.userDict = userDict);
    this.subs.push(this.categoriesObs.subscribe(categories => this.categories = categories));
    this.subs.push(this.tagsObs.subscribe(tags => this.tags = tags));
    this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      if (user) {
        this.user = user;
        if (this.user.tags && this.user.tags.length > 0) {
          this.selectedTags = this.user.tags;
        } else if (this.user.lastGamePlayOption && this.user.lastGamePlayOption.tags.length > 0) {
          this.selectedTags = this.user.lastGamePlayOption.tags;
        } else {
          this.selectedTags = this.tags;
        }
        this.store.dispatch(this.userActions.loadUserFriends(user.userId));
      }
    }));

    this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.userFriends)).subscribe(uFriends => {
      if (uFriends) {
        this.uFriends = [];
        uFriends.myFriends.map(friend => {
          if (this.userDict && !this.userDict[Object.keys(friend)[0]]) {
            this.store.dispatch(this.userActions.loadOtherUserProfile(Object.keys(friend)[0]));
          }
          this.uFriends = [...this.uFriends, ...Object.keys(friend)];
        });
        this.noFriendsStatus = false;
      } else {
        this.noFriendsStatus = true;
      }
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
    this.store.select(appState.coreState).pipe(take(1)).subscribe(s => user = s.user); // logged in user
    gameOptions.friendId = this.friendUserId;
    this.store.dispatch(new gameplayactions.CreateNewGame({ gameOptions: gameOptions, user: user }));
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 70, 60, '70X60');
  }

  removeEnteredTag(tag) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
  }

  selectFriendId(friendId: string) {
    this.friendUserId = friendId;
    this.errMsg = undefined;
  }
}
