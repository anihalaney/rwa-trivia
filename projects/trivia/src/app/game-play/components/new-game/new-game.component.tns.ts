import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { ListViewEventData } from 'nativescript-ui-listview';
import { RadListViewComponent } from 'nativescript-ui-listview/angular';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Utils, WindowRef } from 'shared-library/core/services';
import { GameActions, UserActions } from 'shared-library/core/store/actions';
import { Category, PlayerMode } from 'shared-library/shared/model';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { Page, isIOS } from 'tns-core-modules/ui/page/page';
import { AppState, appState } from '../../../store';
import { NewGame } from './new-game';
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
  private tagItems: ObservableArray<TokenModel>;
  subscriptions = [];
  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;
  challengerUserId: string;
  modeAvailable: boolean;
  @ViewChild('autocomplete') autocomplete: RadAutoCompleteTextViewComponent;
  @ViewChild('friendListView') listViewComponent: RadListViewComponent;

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
    this.modeAvailable = false;
  }
  ngOnInit() {


    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
      // Here listview is refresh in ios because it is not able to render user details.
      // https://github.com/NativeScript/nativescript-ui-feedback/issues/753
      if (this.listViewComponent) {
        if (isIOS) {
          this.listViewComponent.listView.refresh();
        }
      }
    }));

    this.subscriptions.push(
      this.route.params.subscribe(data => {
        if (data && data.userid) {
          this.challengerUserId = data.userid;
          this.gameOptions.playerMode = 1;
          this.gameOptions.opponentType = 1;
          this.gameOptions.isChallenge = true;
          this.friendUserId = data.userid;
        }
        if (data && data.mode) {
          this.modeAvailable = true;
          if (data.mode === 'Single') {
            this.gameOptions.playerMode = 0;
          } else {
            this.gameOptions.playerMode = 1;
            this.gameOptions.opponentType = 0;
          }
        }
      }));

    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
    }));
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

  selectFriendIdApp(friendId: string) {
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
