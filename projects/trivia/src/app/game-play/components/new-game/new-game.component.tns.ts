import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild, Inject, PLATFORM_ID, QueryList, ElementRef, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { RadListViewComponent } from 'nativescript-ui-listview/angular';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Utils, WindowRef } from 'shared-library/core/services';
import { GameActions, UserActions, TagActions } from 'shared-library/core/store/actions';
import { Category, PlayerMode } from 'shared-library/shared/model';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { Page, isIOS } from 'tns-core-modules/ui/page/page';
import { AppState, appState } from '../../../store';
import { NewGame } from './new-game';
import { NavigationService } from 'shared-library/core/services/mobile';

@Component({
  selector: 'new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class NewGameComponent extends NewGame implements OnInit, OnDestroy {


  showSelectPlayer = false;
  showSelectCategory = false;
  showSelectTag = false;
  customTag: string;
  public tagItems: ObservableArray<TokenModel>;
  private _filterFriendFunc: (item: any) => any;
  // pagination: any;
  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;
  challengerUserId: string;
  actionBarTitle = 'Play as single player';

  showModal = false;
  showGameStartLoader = false;
  dialogOpen;
  searchFriend = '';
  selectedTopFilter = 0;
  chooseOptionsStep = 0;
  skipNavigation = false;
  theme: string;

  @ViewChild('autocomplete', { static: false }) autocomplete: RadAutoCompleteTextViewComponent;
  @ViewChild('friendListView', { static: false }) listViewComponent: RadListViewComponent;
  @ViewChildren("textField", { read: false }) textField: QueryList<ElementRef>;
  modeAvailable: boolean;
  constructor(public store: Store<AppState>,
    public gameActions: GameActions,
    public utils: Utils,
    private routerExtension: RouterExtensions,
    public userActions: UserActions,
    public router: Router,
    public route: ActivatedRoute,
    public tagActions: TagActions,
    public cd: ChangeDetectorRef,
    private page: Page,
    public windowRef: WindowRef,
    @Inject(PLATFORM_ID) public platformId: Object,
    private ngZone: NgZone,
    private navigationService: NavigationService) {
    super(store, utils, gameActions, userActions, windowRef, platformId, cd, route, router, tagActions);
    this.initDataItems();
    this.modeAvailable = false;
    this.page.actionBarHidden = true;
    this.filterFriendFunc = (item: any) => {
      if (!this.searchFriend || this.searchFriend === '') {
        return true;
      }
      return (item && item.userId && this.userDict[item.userId] &&
        this.userDict[item.userId].displayName.toLowerCase().search(this.searchFriend.toLowerCase()) >= 0) ? true : false;
    };
  }
  ngOnInit() {

    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
      // Here listview is refresh in ios because it is not able to render user details.
      // https://github.com/NativeScript/nativescript-ui-feedback/issues/753
      if (this.listViewComponent) {
        if (isIOS) {
          // this.listViewComponent.listView.refresh();
        }
      }
    }));

    this.subscriptions.push(
      this.route.params.subscribe(data => {
        if (data && data.userid) {
          this.challengerUserId = data.userid;
          this.gameOptions.playerMode = 1;
          this.gameOptions.opponentType = 1;
          if (this.router.url.indexOf('challenge') > 0) {
            this.gameOptions.isChallenge = true;
          }
          this.chooseOptionsStep = 1;
          this.friendUserId = data.userid;
        }
        if (this.router.url.indexOf('play-game-with-random-user') >= 0) {
          this.gameOptions.playerMode = 1;
          this.gameOptions.opponentType = 0;
          this.chooseOptionsStep = 1;
        }
        if (data && data.mode) {
          this.modeAvailable = true;
          if (data.mode === 'Single') {
            this.gameOptions.playerMode = 0;
            this.actionBarTitle = 'Play as single player';
          } else {
            this.gameOptions.playerMode = 1;
            this.gameOptions.opponentType = 1;
            this.chooseOptionsStep = 0;
            this.actionBarTitle = 'Play as two player';
          }
        }
      }));

    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
    }));
  }

  get filterFriendFunc(): (item: any) => any {
    return this._filterFriendFunc;
  }

  set filterFriendFunc(value: (item: any) => any) {
    this._filterFriendFunc = value;
  }

  showDialog() {
    this.dialogOpen = true;
  }

  // it does nothing but stop the tap event from propagate to background component
  stopEventPropogation() {
    return false;
  }

  back() {
    if (this.chooseOptionsStep === 0 || !this.skipNavigation) {
      this.navigationService.back();
    } else {
      this.chooseOptionsStep = 0;
      this.gameOptions.opponentType = 1;
    }
  }

  ngOnDestroy() {
    this.showSelectPlayer = undefined;
    this.showSelectCategory = undefined;
    this.showSelectTag = undefined;
    this.categories = [];
    this.subscriptions = [];
    this.customTag = undefined;
    this.tagItems = undefined;
    this.filteredCategories = [];
    this.destroy();
    this.page.off('loaded');
    this.renderView = false;
  }

  addCustomTag() {
    if (this.customTag && this.customTag !== '' &&
      this.selectedTags.filter((res) => res.toLowerCase() === this.customTag.toLowerCase()).length === 0) {
      this.selectedTags.push(this.customTag);
    }
    this.customTag = '';
    if (this.autocomplete) {
      this.autocomplete.autoCompleteTextView.resetAutoComplete();
    }

  }

  onSearchFriendTextChange(event) {
    this.searchFriend = event.value;
    if (this.listViewComponent) {
      const listView = this.listViewComponent.listView;
      listView.filteringFunction = undefined;
      listView.filteringFunction = this.filterFriendFunc;
    }

  }

  startGame() {
    this.showGameStartLoader = true;
    this.gameOptions.tags = this.topTags.filter(c => c.requiredForGamePlay || c.isSelected).map(c => c.key);
    this.gameOptions.categoryIds = this.filteredCategories.filter(c => c.requiredForGamePlay || c.isSelected).map(c => c.id);
    if (this.validateGameOptions(true, this.gameOptions)) {
      if (this.gameOptions.playerMode === PlayerMode.Single) {
        delete this.gameOptions.opponentType;
      }
      this.startNewGame(this.gameOptions);
    }

  }



  selectCategory(args: number) {
    const category: Category = this.filteredCategories[args];
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

  public initDataItems() {
    this.tagItems = new ObservableArray<TokenModel>();
    if (this.tags) {
      for (let i = 0; i < this.tags.length; i++) {
        this.tagItems.push(new TokenModel(this.tags[i], undefined));
      }
    }
  }

  public onDidAutoComplete(args) {
    this.customTag = args.text;
  }

  public onTextChanged(args) {
    this.customTag = args.text;
  }

  selectFriendIdApp(friend: any) {
    this.friendUserId = friend.userId;
    this.chooseOptionsStep = 1;
    this.skipNavigation = true;
    if (this.listViewComponent) {
      this.listViewComponent.listView.refresh();
    }
  }

  navigateToInvite() {
    this.ngOnDestroy();
    this.router.navigate(['/user/my/app-invite-friends-dialog', { showSkip: false }]);
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

  chooseRandomPlayer() {
    this.gameOptions.opponentType = 0;
    this.gameOptions.playerMode = 1;
    this.chooseOptionsStep = 1;
    this.friendUserId = null;
    this.skipNavigation = true;
  }

  changePlayGameWith(playerMode = 1) {
    this.gameOptions.playerMode = playerMode;
    this.gameOptions.opponentType = 1;
    this.chooseOptionsStep = 0;
    this.friendUserId = null;

    // Reset friend filter when switch game option playerMode
    if (this.gameOptions.playerMode !== 0) {
      this.searchFriend = '';
    }


  }

  hideKeyboard() {
    this.utils.hideKeyboard(this.textField);
  }
}
