import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Utils, WindowRef } from 'shared-library/core/services';
import { GameActions, UserActions } from 'shared-library/core/store/actions';
import { Category, GameMode, GameOptions, OpponentType, PlayerMode } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { NewGame } from './new-game';
import { SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
@Component({
  selector: 'new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class NewGameComponent extends NewGame implements OnInit, OnDestroy {
  categories: Category[];
  sortedCategories: Category[];
  tags: string[];
  subscriptions = [];
  selectedTags: string[];
  selectedCategories = [];

  newGameForm: FormGroup;
  gameOptions: GameOptions;

  showUncheckedCategories = false;
  filteredTags$: Observable<string[]>;

  friendUserId: string;
  loaderStatus = false;

  public config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 5,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: true,
    pagination: false
  };
  @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;

  get categoriesFA(): FormArray {
    return this.newGameForm.get('categoriesFA') as FormArray;
  }
  constructor(private fb: FormBuilder,
    public store: Store<AppState>,
    public gameActions: GameActions,
    private windowRef: WindowRef,
    private router: Router,
    public userActions: UserActions,
    public utils: Utils,
    public snackBar: MatSnackBar,
    public cd: ChangeDetectorRef) {
    super(store, utils, gameActions, userActions, cd);

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.gameCreateStatus)).subscribe(gameCreateStatus => {
      if (gameCreateStatus) {
        this.redirectToDashboard(gameCreateStatus);
      }
      this.cd.markForCheck();
    }));

    this.store.select(appState.coreState).pipe(select(s => s.applicationSettings), take(1))
      .subscribe(appSettings => {
        if (appSettings) {
          this.applicationSettings = appSettings[0];
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

          if (this.applicationSettings && this.applicationSettings.lives.enable) {
            this.store.select(appState.coreState).pipe(select(s => s.account), take(1)).subscribe(account => {
              if (account) {
                this.life = account.lives;
              }
              this.cd.markForCheck();
            });
          }

          const sortedCategories = [...filteredCategories.filter(c => c.requiredForGamePlay),
          ...filteredCategories.filter(c => !c.requiredForGamePlay)];

          this.sortedCategories = sortedCategories;

          sortedCategories.map(category => {
            category.isCategorySelected = this.isCategorySelected(category.id, category.requiredForGamePlay);
            if (this.isCategorySelected(category.id, category.requiredForGamePlay)) {
              this.selectedCategories.push(category.id);
            }
          });
          this.cd.markForCheck();
          // this.cd.detectChanges();
        }
      });
  }

  ngOnInit() {

    this.gameOptions = new GameOptions();

    this.newGameForm = this.createForm(this.gameOptions);

    const playerModeControl = this.newGameForm.get('playerMode');
    playerModeControl.setValue('0');
    const opponentTypeControl = this.newGameForm.get('opponentType');

    this.subscriptions.push(playerModeControl.valueChanges.subscribe(v => {
      if (v === '1') {
        opponentTypeControl.enable();
        opponentTypeControl.setValue('0');
      } else {
        opponentTypeControl.disable();
        opponentTypeControl.reset();
      }
    }));

    this.filteredTags$ = this.newGameForm.get('tagControl').valueChanges
      .pipe(map(val => val.length > 0 ? this.filter(val) : []));
  }

  autoOptionClick(event) {
    // Auto complete doesn't seem to have an event on selection of an entry
    // tap into the change event of the input box and if the tag matches any entry in the tag list, then add to the selected tag list
    // else wait for the user to click "Add" if they still want to add tags that are not on the list

    const tag: string = event.srcElement.value;
    const found = this.tags.find(t => t.toLowerCase() === tag.toLowerCase());

    if (found) {
      this.addTagToSelectedList(found);
      this.newGameForm.get('tagControl').setValue('');
    }
  }
  addTagToSelectedList(tag: string) {
    if (tag && tag !== '' && this.selectedTags.filter((res) => res.toLowerCase() === tag.toLowerCase()).length === 0) {
      this.selectedTags.push(tag);
    }
  }


  toggleShowUncheckedCategories() {
    this.showUncheckedCategories = true;
  }
  addTag() {
    const tagControl = this.newGameForm.get('tagControl');
    this.addTagToSelectedList(tagControl.value);
    tagControl.setValue('');
  }

  createForm(gameOptions: GameOptions) {

    let fcs: FormControl[] = gameOptions.tags.map(tag => {
      const fc = new FormControl(tag);
      return fc;
    });
    if (fcs.length === 0) {
      fcs = [new FormControl('')];
    }

    const tagsFA = new FormArray(fcs);

    const form: FormGroup = this.fb.group({
      playerMode: [gameOptions.playerMode, Validators.required],
      opponentType: [gameOptions.opponentType],
      gameMode: [gameOptions.gameMode, Validators.required],
      tagControl: '',
      tagsArray: tagsFA
    } //, {validator: questionFormValidator}
    );
    return form;
  }


  selectFriendId(friendId: string) {
    this.friendUserId = friendId;
    this.errMsg = undefined;
  }

  selectCategory(event: any, categoryId: number): void {
    if (event.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories.splice(this.selectedCategories.indexOf(categoryId), 1);
    }
  }

  onSubmit() {
    // validations
    this.newGameForm.updateValueAndValidity();
    if (this.newGameForm.invalid) {
      return;
    }

    this.loaderStatus = true;

    const gameOptions: GameOptions = this.getGameOptionsFromFormValue(this.newGameForm.value);

    if (Number(gameOptions.playerMode) === PlayerMode.Opponent && Number(gameOptions.opponentType) === OpponentType.Friend
      && !this.friendUserId) {
      if (!this.friendUserId) {
        this.errMsg = 'Please Select Friend';
      }
      this.loaderStatus = false;
      if (this.windowRef && this.windowRef.nativeWindow && this.windowRef.nativeWindow.scrollTo) {
        this.windowRef.nativeWindow.scrollTo(0, 0);
      }
      return;
    }
    // if (this.applicationSettings.lives.enable && this.life === 0) {
    //   this.redirectToDashboard(this.gameErrorMsg);
    //   return false;
    // }
    this.startNewGame(gameOptions);
  }


  getGameOptionsFromFormValue(formValue: any): GameOptions {
    let gameOptions: GameOptions;

    gameOptions = new GameOptions();
    gameOptions.playerMode = formValue.playerMode;
    gameOptions.opponentType = (formValue.opponentType) ? formValue.opponentType : null;
    gameOptions.categoryIds = this.selectedCategories;
    gameOptions.gameMode = GameMode.Normal;
    gameOptions.tags = this.selectedTags;

    return gameOptions;
  }

  redirectToDashboard(msg) {
    this.router.navigate(['/dashboard']);
    this.snackBar.open(String(msg), '', {
      duration: 2000,
    });
  }
  ngOnDestroy() {
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
}
