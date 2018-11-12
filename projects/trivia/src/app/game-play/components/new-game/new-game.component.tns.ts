import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { GameActions } from 'shared-library/core/store/actions';
import { Category } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { NewGame } from './new-game';
import { Utils } from 'shared-library/core/services';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { RouterExtensions } from 'nativescript-angular/router';
import * as gamePlayActions from './../../store/actions';
import { filter } from 'rxjs/operators';
import { UserActions } from 'shared-library/core/store/actions';

@Component({
  selector: 'new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent extends NewGame implements OnInit, OnDestroy {

  playerMode = 0;
  showSelectPlayer = false;
  showSelectCategory = false;
  showSelectTag = false;
  dataItem;
  categoriesObs: Observable<Category[]>;
  categories: Category[];
  subs: Subscription[] = [];
  customTag: string;
  categoryIds: number[] = [];
  private tagItems: ObservableArray<TokenModel>;
  sub3: Subscription;
  @ViewChild('autocomplete') autocomplete: RadAutoCompleteTextViewComponent;

  constructor(public store: Store<AppState>,
    public gameActions: GameActions,
    public utils: Utils,
    private routerExtension: RouterExtensions,
    public userActions: UserActions) {
    super(store, utils, userActions);
    this.initDataItems();
  }

  ngOnInit() {

    this.sub3 = this.store.select(appState.gamePlayState).pipe(select(s => s.newGameId), filter(g => g !== '')).subscribe(gameObj => {
      this.routerExtension.navigate(['/game-play', gameObj['gameId']]);
      this.store.dispatch(new gamePlayActions.ResetCurrentQuestion());
    });

    // this.dataItem = data;
    this.categories = [...this.categories.filter(c => c.requiredForGamePlay), ...this.categories.filter(c => !c.requiredForGamePlay)];

    this.subs.push(this.store.select(appState.userState).pipe(select(s => s.userFriends)).subscribe(uFriends => {
      if (uFriends) {
        this.uFriends = [];
        uFriends.myFriends.map(friend => {
          this.uFriends = [...this.uFriends, ...Object.keys(friend)];
        });
        this.dataItem = this.uFriends;
        this.noFriendsStatus = false;
      } else {
        this.noFriendsStatus = true;
      }

    }));
    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.userDict$.subscribe(userDict => this.userDict = userDict);
    // this.dataItem = this.uFriends;

  }

  ngOnDestroy() { }

  addCustomTag() {
    this.selectedTags.push(this.customTag);
    this.customTag = '';
    this.autocomplete.autoCompleteTextView.resetAutocomplete();
  }

  startGame() {
    this.gameOptions.tags = this.selectedTags;
    this.gameOptions.categoryIds = this.categories.filter(c => c.requiredForGamePlay || c.isSelected).map(c => c.id);
    this.startNewGame(this.gameOptions);
  }

  selectCategory(category) {
    category.isSelected = (!category.isSelected) ? true : false;
  }

  getSelectedCatName() {
    return this.categories.filter(c => c.requiredForGamePlay || c.isSelected).map(c => c.categoryName).join(', ');
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
}

