import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Utils, WindowRef } from 'shared-library/core/services';
import { GameActions, UserActions, TagActions } from 'shared-library/core/store/actions';
import { Category, GameMode, GameOptions } from 'shared-library/shared/model';
import { AppState } from '../../../store';
import { NewGame } from './new-game';

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
  selectedTags: string[];


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
  @ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;

  get categoriesFA(): FormArray {
    return this.newGameForm.get('categoriesFA') as FormArray;
  }
  constructor(private fb: FormBuilder,
    public store: Store<AppState>,
    public gameActions: GameActions,
    public windowRef: WindowRef,
    @Inject(PLATFORM_ID) public platformId: Object,
    public router: Router,
    public route: ActivatedRoute,
    public userActions: UserActions,
    public utils: Utils,
    public snackBar: MatSnackBar,
    public cd: ChangeDetectorRef,
    public tagActions: TagActions) {
    super(store, utils, gameActions, userActions, windowRef, platformId, cd, route, router, tagActions);
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
          playerModeControl.setValue((this.challengerUserId || this.router.url.indexOf('play-game-with-random-user') >= 0 ) ? '1' : '0');
          const isChallengeControl = this.newGameForm.get('isChallenge');
          isChallengeControl.setValue(this.challengerUserId && this.router.url.indexOf('challenge') >= 0  ? true : false);
          if (this.challengerUserId) {
            opponentTypeControl.setValue('1');
          } else if (params.mode && params.mode === 'Two') {
            playerModeControl.setValue('1');
            opponentTypeControl.setValue('0');
          } else if (params.mode && params.mode === 'Single') {
            playerModeControl.setValue('0');
          }

          if (this.router.url.indexOf('play-game-with-random-user') >= 0) {
            opponentTypeControl.setValue('0');
          }

          if (this.challengerUserId) {
            this.selectFriendId(this.challengerUserId);
          }

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
      isChallenge: gameOptions.isChallenge,
      friendUserId: ''
    } //, {validator: questionFormValidator}
    );
    return form;
  }


  selectFriendId(friendId: string) {
    this.friendUserId = friendId;
    this.errMsg = undefined;
    const friendUserIdControl = this.newGameForm.get('friendUserId');
    friendUserIdControl.setValue(friendId);
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
    gameOptions.tags = this.topTags ? this.topTags.filter(c => c.requiredForGamePlay || c.isSelected).map(c => c.key) : [];
    gameOptions.isChallenge = formValue.isChallenge;

    return gameOptions;
  }


  ngOnDestroy() {
  }


}