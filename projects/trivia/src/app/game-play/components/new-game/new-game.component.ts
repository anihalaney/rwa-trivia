import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable } from 'rxjs';
import { map, take, flatMap, skipWhile } from 'rxjs/operators';
import { Utils, WindowRef } from 'shared-library/core/services';
import { GameActions, UserActions } from 'shared-library/core/store/actions';
import {
  Category, GameMode, GameOptions, OpponentType, PlayerMode, FirebaseAnalyticsKeyConstants,
  FirebaseAnalyticsEventConstants, GameConstants
} from 'shared-library/shared/model';
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


  challengerUserId: string;
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
    public windowRef: WindowRef,
    public router: Router,
    public route: ActivatedRoute,
    public userActions: UserActions,
    public utils: Utils,
    public snackBar: MatSnackBar,
    public cd: ChangeDetectorRef) {
    super(store, utils, gameActions, userActions, windowRef, cd, route, router);

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.gameCreateStatus)).subscribe(gameCreateStatus => {
      if (gameCreateStatus) {
        this.redirectToDashboard(gameCreateStatus);
      }
      this.cd.markForCheck();
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

            this.cd.markForCheck();


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
    const opponentTypeControl = this.newGameForm.get('opponentType');
    this.subscriptions.push(
      this.route.params.pipe(
        map(params => {
          this.challengerUserId = params.userid;
          playerModeControl.setValue(this.challengerUserId ? '1' : '0');
          const isChallengeControl = this.newGameForm.get('isChallenge');
          isChallengeControl.setValue(this.challengerUserId ? true : false);
          if (this.challengerUserId) {
            opponentTypeControl.setValue('1');
          }

          if (this.challengerUserId) {
            this.selectFriendId(this.challengerUserId);
          }

          this.filteredTags$ = this.newGameForm.get('tagControl').valueChanges
            .pipe(map(val => val.length > 0 ? this.filter(val) : []));
        }),
        flatMap(() => playerModeControl.valueChanges)
      ).subscribe(v => {
        if (v === '1') {
          opponentTypeControl.enable();
          opponentTypeControl.setValue('0');
        } else {
          opponentTypeControl.disable();
          opponentTypeControl.reset();
        }

      })
    );

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
      tagsArray: tagsFA,
      isChallenge: gameOptions.isChallenge
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
    this.newGameForm.updateValueAndValidity();
    if (this.newGameForm.invalid) {
      return;
    }

    this.loaderStatus = true;

    const gameOptions: GameOptions = this.getGameOptionsFromFormValue(this.newGameForm.value);

    this.validateGameOptions(false, gameOptions);

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
    gameOptions.isChallenge = formValue.isChallenge;

    return gameOptions;
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
