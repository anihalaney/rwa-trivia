import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { ListViewEventData } from 'nativescript-ui-listview';
import { RadListViewComponent } from 'nativescript-ui-listview/angular';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Utils, WindowRef } from 'shared-library/core/services';
import { coreState } from 'shared-library/core/store';
import { GameActions, UserActions } from 'shared-library/core/store/actions';
import { Category, PlayerMode } from 'shared-library/shared/model';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { Page } from 'tns-core-modules/ui/page/page';
import { AppState, appState } from '../../../store';
import * as gamePlayActions from './../../store/actions';
import { NewGame } from './new-game';

@Component({
  selector: 'new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class NewGameComponent extends NewGame implements OnInit, OnDestroy {

  playerMode = 0;
  showSelectPlayer = false;
  showSelectCategory = false;
  showSelectTag = false;
  dataItem;
  categoriesObs: Observable<Category[]>;
  customTag: string;
  categoryIds: number[] = [];
  private tagItems: ObservableArray<TokenModel>;
  filteredCategories: Category[];
  subscriptions = [];
  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;
  challengerUserId: string;
  @ViewChild('autocomplete', { static: false }) autocomplete: RadAutoCompleteTextViewComponent;
  @ViewChild('friendListView', { static: false }) listViewComponent: RadListViewComponent;

  constructor(public store: Store<AppState>,
    public gameActions: GameActions,
    public utils: Utils,
    private routerExtension: RouterExtensions,
    public userActions: UserActions,
    public router: Router,
    public route: ActivatedRoute,
    public cd: ChangeDetectorRef,
    private page: Page,
    public windowRef: WindowRef,
    private ngZone: NgZone) {
    super(store, utils, gameActions, userActions, windowRef, cd, route, router);
    this.initDataItems();
  }
  ngOnInit() {

    this.subscriptions.push(
      this.route.params.subscribe(data => {
        if (data && data.userid) {
          this.challengerUserId = data.userid;
          this.gameOptions.playerMode = 1;
          this.gameOptions.opponentType = 1;
          this.gameOptions.isChallenge = true;
          this.friendUserId = data.userid;
        }
      }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {
      if (gameObj && gameObj['gameId']) {
        this.routerExtension.navigate(['/game-play', gameObj['gameId']], { clearHistory: true });
        this.store.dispatch(new gamePlayActions.ResetCurrentQuestion());
        this.cd.markForCheck();
      }

    }));

    this.categoriesObs.pipe(take(1)).subscribe(categories => {
      categories.map(category => {
        if (this.user.categoryIds && this.user.categoryIds.length > 0) {
          category.isSelected = this.user.categoryIds.includes(category.id);
        } else if (this.user.lastGamePlayOption && this.user.lastGamePlayOption.categoryIds.length > 0) {
          category.isSelected = this.user.lastGamePlayOption.categoryIds.includes(category.id);
        } else {
          category.isSelected = true;
        }
        this.cd.markForCheck();
        return category;
      });
      this.cd.markForCheck();
      this.store.select(appState.coreState).pipe(select(s => s.applicationSettings), take(1)).subscribe(
        appSettings => {
          if (appSettings) {
            this.applicationSettings = appSettings[0];
            let filteredCategories = [];
            if (this.applicationSettings) {
              filteredCategories = this.categories.filter((category) => {
                if (this.applicationSettings.game_play_categories.indexOf(Number(category.id)) > -1) {
                  return category;
                }
              });
              if (this.applicationSettings && this.applicationSettings.lives.enable) {
                this.store.select(appState.coreState).pipe(select(s => s.account), take(1)).subscribe(account => {
                  if (account) {
                    this.life = account.lives;
                  }
                  this.cd.markForCheck();
                });
              }
            } else {
              filteredCategories = this.categories;
            }

            this.filteredCategories = [...filteredCategories.filter(c => c.requiredForGamePlay),
            ...filteredCategories.filter(c => !c.requiredForGamePlay)];
          }
          this.cd.markForCheck();
        });

    });

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.gameCreateStatus)).subscribe(gameCreateStatus => {
      if (gameCreateStatus) {
        this.redirectToDashboard(gameCreateStatus);
      }
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.userFriends)).subscribe((uFriends: any) => {
      if (uFriends) {
        this.uFriends = [];
        uFriends.map(friend => {
          this.uFriends = [...this.uFriends, ...friend.userId];
        });
        this.dataItem = this.uFriends;
        this.noFriendsStatus = false;
      } else {
        this.noFriendsStatus = true;
      }
      this.cd.markForCheck();
    }));

    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
    }));
  }

  ngOnDestroy() {
    this.playerMode = undefined;
    this.showSelectPlayer = undefined;
    this.showSelectCategory = undefined;
    this.showSelectTag = undefined;
    this.dataItem = undefined;
    this.categoriesObs = undefined;
    this.categories = [];
    this.subscriptions = [];
    this.customTag = undefined;
    this.categoryIds = [];
    this.tagItems = undefined;
    this.filteredCategories = [];
    this.destroy();
    this.page.off('loaded');
  }

  addCustomTag() {
    if (this.customTag && this.customTag !== '' &&
      this.selectedTags.filter((res) => res.toLowerCase() === this.customTag.toLowerCase()).length === 0) {
      this.selectedTags.push(this.customTag);
    }
    this.customTag = '';
    this.autocomplete.autoCompleteTextView.resetAutoComplete();
  }

  startGame() {
    this.gameOptions.tags = this.selectedTags;
    this.gameOptions.categoryIds = this.filteredCategories.filter(c => c.requiredForGamePlay || c.isSelected).map(c => c.id);
    this.validateGameOptions(true, this.gameOptions);

    if (this.gameOptions.playerMode === PlayerMode.Single) {
      delete this.gameOptions.opponentType;
    }

    this.startNewGame(this.gameOptions);
  }



  selectCategory(args: ListViewEventData) {
    const category: Category = this.filteredCategories[args.index];
    if (!category.requiredForGamePlay) {
      category.isSelected = !category.isSelected;
      this.filteredCategories = [... this.filteredCategories];
    }
  }

  getSelectedCatName() {
    return this.filteredCategories.filter(c => c.requiredForGamePlay || c.isSelected).map(c => c.categoryName).join(', ');
  }

  getPlayerMode() {
    return this.gameOptions.playerMode ? 'Single Player' : 'Two Player';
  }

  getGameMode() {
    let opponentType = '';
    if (this.gameOptions.playerMode === 1) {
      switch (this.gameOptions.opponentType) {
        case 0:
          opponentType = 'Random';
          break;
        case 1:
          opponentType = 'With Friend';
          break;
        case 2:
          opponentType = 'With Computer';
          break;
      }
    }
    return opponentType;
  }

  get dataItems(): ObservableArray<TokenModel> {
    return this.tagItems;
  }

  private initDataItems() {
    this.tagItems = new ObservableArray<TokenModel>();

    for (let i = 0; i < this.tags.length; i++) {
      this.tagItems.push(new TokenModel(this.tags[i], undefined));
    }
  }

  public onDidAutoComplete(args) {
    this.customTag = args.text;
  }

  public onTextChanged(args) {
    this.customTag = args.text;
  }

  selectFriendId(friendId: string) {
    this.friendUserId = friendId;
    this.listViewComponent.listView.refresh();
  }

  navigateToInvite() {
    this.ngOnDestroy();
    this.router.navigate(['/user/my/app-invite-friends-dialog']);
  }

  redirectToDashboard(msg) {
    this.router.navigate(['/dashboard']);
    this.utils.showMessage('success', msg);
  }

  get categoryListHeight() {
    return 60 * this.filteredCategories.length;
  }

  get tagsHeight() {
    return (60 * this.selectedTags.length) + 20;
  }


}

