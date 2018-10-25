import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { GameActions } from 'shared-library/core/store/actions';
import { Category } from 'shared-library/shared/model';
import { AppState } from '../../../store';
import { NewGame } from './new-game';
import { Utils } from 'shared-library/core/services';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { RouterExtensions } from 'nativescript-angular/router';

const data = [{ id: 1, name: 'name 1', image: 'image' },
{ id: 2, name: 'name 2', image: 'image' },
{ id: 3, name: 'name 3', image: 'image' },
{ id: 1, name: 'name 1', image: 'image' },
{ id: 2, name: 'name 2', image: 'image' },
{ id: 3, name: 'name 3', image: 'image' },
{ id: 1, name: 'name 1', image: 'image' },
{ id: 2, name: 'name 2', image: 'image' },
{ id: 3, name: 'name 3', image: 'image' }];

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
  private tagItems: ObservableArray<TokenModel>;
  @ViewChild('autocomplete') autocomplete: RadAutoCompleteTextViewComponent;

  constructor(public store: Store<AppState>,
    public gameActions: GameActions,
    public utils: Utils,
    private routerExtension: RouterExtensions) {
    super(store, utils);
    this.initDataItems();
  }

  ngOnInit() {
    this.dataItem = data;
    this.categories = [...this.categories.filter(c => c.requiredForGamePlay), ...this.categories.filter(c => !c.requiredForGamePlay)];
  }

  ngOnDestroy() { }

  addCustomTag() {
    this.selectedTags.push(this.customTag);
    this.customTag = '';
    this.autocomplete.autoCompleteTextView.resetAutocomplete();
  }

  startGame() {
    this.gameOptions.tags = this.selectedTags;
    this.gameOptions.categoryIds = this.gameActions.categoryIds;
    this.startNewGame(this.gameOptions);
  }

  selectCategory(category) {
    category.isSelected = (!category.isSelected) ? true : false;
    this.gameActions.categoryIds = this.categories.filter(c => c.requiredForGamePlay || c.isSelected).map(c => c.id);
  }

  getSelectedCatName() {
    return this.categories.filter(c => c.requiredForGamePlay || c.isSelected).map(c => c.categoryName).join(', ');
  }

  getPlayerMode() {
    return this.gameOptions.playerMode ? 'Single Player' : 'Two Player';
  }

  getGameMode() {
    let gameMode = '';
    if (this.gameOptions.playerMode === 1) {
      switch (this.gameOptions.gameMode) {
        case 0:
          gameMode = 'Random';
          break;
        case 1:
          gameMode = 'With Friend';
          break;
        case 2:
          gameMode = 'With Computer';
          break;
      }
    }
    return gameMode;
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

