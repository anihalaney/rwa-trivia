import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { AppStore } from '../../../core/store/app-store';
import { GameActions } from '../../../core/store/actions';
import { Utils } from '../../../core/services';
import { Category, GameOptions, GameMode, User }     from '../../../model';

@Component({
  selector: 'new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit, OnDestroy {
  categoriesObs: Observable<Category[]>;
  categories: Category[];
  tagsObs: Observable<string[]>;
  tags: string[];
  selectedTags: string[];
  sub: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  newGameForm: FormGroup;
  gameOptions: GameOptions;

  showUncheckedCategories: boolean = false;
  allCategoriesSelected: boolean = true;

  filteredTags: Observable<string[]>;

  get categoriesFA(): FormArray { 
    //console.log(this.newGameForm.get('categoriesFA'));
    return this.newGameForm.get('categoriesFA') as FormArray; 
  }
  constructor(private fb: FormBuilder,
              private store: Store<AppStore>,
              private gameActions: GameActions,
              private router: Router) {
    this.categoriesObs = store.select(s => s.categories);
    this.tagsObs = store.select(s => s.tags);
    this.selectedTags = [];
  }

  ngOnInit() {
    this.store.dispatch(this.gameActions.resetNewGame());

    this.sub = this.categoriesObs.subscribe(categories => this.categories = categories);
    this.sub2 = this.tagsObs.subscribe(tags => this.tags = tags);
    this.sub3 = this.store.select(s => s.newGameId).filter(g => g != "").subscribe(gameId => {
      console.log("Navigating to game: " + gameId);
      this.router.navigate(['game', gameId]);
      this.store.dispatch(this.gameActions.resetCurrentQuestion());
    })

    this.gameOptions = new GameOptions();
    this.newGameForm = this.createForm(this.gameOptions);

    let playerModeControl = this.newGameForm.get('playerMode');
    let opponentTypeControl = this.newGameForm.get('opponentType');

    playerModeControl.valueChanges.subscribe(v => {
      if (v == "1") {
        opponentTypeControl.enable();
        opponentTypeControl.setValue("0");
      }
      else {
        opponentTypeControl.disable ();
        opponentTypeControl.reset();
      }
    });

    /*
    this.categoriesFA.valueChanges.subscribe(v => {
      //console.log(v);
      let categoryValues: any[] = v;
      if (categoryValues.find(c => (!c.categorySelected && !c.requiredForGamePlay)))
        this.allCategoriesSelected = false;
      else {
        this.allCategoriesSelected = true;
      }
    });
    */

    this.filteredTags = this.newGameForm.get('tagControl').valueChanges
         .map(val => val.length > 0 ? this.filter(val) : []);
  }

  filter(val: string): string[] {
      return this.tags.filter(option => new RegExp(Utils.regExpEscape(`${val}`), 'gi').test(option)); 
   }
   autoOptionClick(event) {
     //Auto complete doesn't seem to have an event on selection of an entry
     //tap into the change event of the input box and if the tag matches any entry in the tag list, then add to the selected tag list
     //else wait for the user to click "Add" if they still want to add tags that are not on the list

    //console.log(event);
    //console.log(event.srcElement.value);
    let tag: string = event.srcElement.value;
    let found = this.tags.find(t => t.toLowerCase() === tag.toLowerCase());
    //console.log(found);
    if (found)
    {
      this.addTagToSelectedList(found);
      this.newGameForm.get('tagControl').setValue('');
    }
   }
   addTagToSelectedList(tag: string)
   {
     if (tag && tag !== "")
      this.selectedTags.push(tag);
   }
  ngOnDestroy() {
    Utils.unsubscribe([this.sub, this.sub2, this.sub3]);
  }

  toggleShowUncheckedCategories()
  {
    this.showUncheckedCategories = true;
  }
  addTag() 
  {
    let tagControl = this.newGameForm.get('tagControl');
    this.addTagToSelectedList(tagControl.value);
    //console.log(this.selectedTags);
    tagControl.setValue('');
  }
  removeEnteredTag(tag) 
  {
    this.selectedTags = this.selectedTags.filter(t => t !== tag); 
  }
  createForm(gameOptions: GameOptions) {

    let sortedCategories = [...this.categories.filter(c => c.requiredForGamePlay), ...this.categories.filter(c => !c.requiredForGamePlay)]
    let fgs:FormGroup[] = sortedCategories.map(category => {
      let fg = new FormGroup({
        categorySelected: new FormControl({value: true, disabled: category.requiredForGamePlay}),
        categoryId: new FormControl(category.id),
        categoryName: new FormControl(category.categoryName),
        requiredForGamePlay: new FormControl(category.requiredForGamePlay)
      });
      return fg;
    });
    let categoriesFA = new FormArray(fgs);

    let fcs:FormControl[] = gameOptions.tags.map(tag => {
      let fc = new FormControl(tag);
      return fc;
    });
    if (fcs.length == 0)
      fcs = [new FormControl('')];
    let tagsFA = new FormArray(fcs);

    let form: FormGroup = this.fb.group({
      playerMode: [gameOptions.playerMode, Validators.required],
      opponentType: [{value: gameOptions.opponentType, disabled: true} ],
      gameMode: [gameOptions.gameMode, Validators.required],
      tagControl: '',
      tagsArray: tagsFA,
      categoriesFA: categoriesFA
      } //, {validator: questionFormValidator}
    );
    //console.log(form);
    return form;
  }

  onSubmit() {
    //validations
    this.newGameForm.updateValueAndValidity();
    if (this.newGameForm.invalid)
      return;

    //console.log(this.newGameForm.value);
    let gameOptions: GameOptions = this.getGameOptionsFromFormValue(this.newGameForm.value);
    console.log(gameOptions);

    this.startNewGame(gameOptions);
  }
  
  startNewGame(gameOptions: GameOptions) {
    let user: User;
    this.store.take(1).subscribe(s => user = s.user); //logged in user

    this.store.dispatch(this.gameActions.createNewGame({gameOptions: gameOptions, user: user}));
  }

  getGameOptionsFromFormValue(formValue: any): GameOptions {
    let gameOptions: GameOptions;

    gameOptions = new GameOptions();
    gameOptions.playerMode = formValue.playerMode;
    gameOptions.opponentType = (formValue.opponentType) ? formValue.opponentType : null;
    gameOptions.categoryIds = this.categoriesFA.value.filter(c => c.categorySelected || c.requiredForGamePlay).map(c => c.categoryId);
    gameOptions.gameMode = GameMode.Normal;
    gameOptions.tags = this.selectedTags;

    return gameOptions;
  }
}
