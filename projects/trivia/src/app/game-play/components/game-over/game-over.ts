import { Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User, Game, PlayerMode, OpponentType, Account, ApplicationSettings } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { UserActions } from 'shared-library/core/store/actions';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as gameplayactions from '../../store/actions';
import * as socialactions from '../../../social/store/actions';
import { gamePlayState } from '../../store';

export class GameOver implements OnInit {

  @Input() correctCount: number;
  @Input() noOfQuestions: number;
  @Output() gameOverContinueClicked = new EventEmitter();
  @Output() viewQuestionClicked = new EventEmitter<any>();
  @Input() categoryName: string;
  @Input() game: Game;
  @Input() userDict: { [key: string]: User };
  @Input() totalRound: number;

  user$: Observable<User>;
  user: User;
  otherUserId: string;
  otherUserInfo: User;
  questionsArray = [];
  socialFeedData;
  imageUrl = '';
  disableRematchBtn = false;
  PlayerMode = PlayerMode;
  userDict$: Observable<{ [key: string]: User }>;
  loaderStatus = false;
  playerUserName = 'You';
  opponentType = OpponentType;
  disableFriendInviteBtn = false;
  defaultAvatar = 'assets/images/default-avatar-game-over.png';
  subs: Subscription[] = [];
  account: Account;
  applicationSettings: ApplicationSettings;
  liveErrorMsg = 'Sorry, don\'t have enough life.';

  continueButtonClicked(event: any) {
    this.gameOverContinueClicked.emit();
  }

  constructor(public store: Store<AppState>, public userActions: UserActions,
    public utils: Utils) {

    this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
      }
    }));

    this.subs.push(store.select(appState.coreState).pipe(select(s => s.account)).subscribe(account => {
      this.account = account;
    }));

    this.user$ = this.store.select(appState.coreState).pipe(select(s => s.user));
    this.user$.subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    });

    this.socialFeedData = {
      blogNo: 0,
      share_status: false,
      link: this.imageUrl
    };
    this.store.dispatch(new socialactions.LoadSocialScoreShareUrlSuccess(null));

    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subs.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
    }));

    this.subs.push(this.store.select(gamePlayState).pipe(select(s => s.userAnsweredQuestion)).subscribe(stats => {
      if (stats != null) {
        this.questionsArray = stats;
        this.questionsArray.map((question) => {
          if (!this.userDict[question.created_uid]) {
            this.store.dispatch(this.userActions.loadOtherUserProfile(question.created_uid));
          }
        });
      }
    }));
  }

  ngOnInit() {
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }
  }

  bindQuestions() {
    if (this.questionsArray.length === 0) {
      this.store.dispatch(new gameplayactions.GetUsersAnsweredQuestion({ userId: this.user.userId, game: this.game }));
    }
  }

  reMatch() {
    this.socialFeedData.share_status = false;
    this.disableRematchBtn = true;
    this.game.gameOptions.rematch = true;
    if (this.game.playerIds.length > 0) {
      this.game.gameOptions.friendId = this.game.playerIds.filter(playerId => playerId !== this.user.userId)[0];
    }
    this.store.dispatch(new gameplayactions.CreateNewGame({ gameOptions: this.game.gameOptions, user: this.user }));
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 44, 40, '44X40');
  }

  inviteAsFriend() {
    if (!this.disableFriendInviteBtn) {
      const inviteeUserId = (this.user.userId === this.game.playerIds[0]) ? this.game.playerIds[1] : this.game.playerIds[0];
      this.store.dispatch(this.userActions.addUserInvitation(
        { userId: this.user.userId, inviteeUserId: inviteeUserId }));
    }
  }
}
