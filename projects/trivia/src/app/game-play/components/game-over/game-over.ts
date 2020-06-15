import { Input, Output, EventEmitter, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { User, Game, PlayerMode, OpponentType, Account, ApplicationSettings, Invitation, userCardType } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { UserActions } from 'shared-library/core/store/actions';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as gameplayactions from '../../store/actions';
import * as dashboardactions from '../../../dashboard/store/actions';
import { gamePlayState } from '../../store';
import { skipWhile, map, flatMap, take } from 'rxjs/operators';

export enum GameStatus {
  WON,
  LOST,
  TIE,
  DRAW,
  START
}

export class GameOver implements OnInit, OnChanges {

  @Input() correctCount: number;
  @Input() noOfQuestions: number;
  @Output() gameOverContinueClicked = new EventEmitter();
  @Output() viewQuestionClicked = new EventEmitter<any>();
  @Input() categoryName: string;
  @Input() game: Game;
  @Input() userDict: { [key: string]: User };
  @Input() totalRound: number;
  @Input() earnedBadgesByOtherUser;
  @Input() earnedBadges;
  @Input() totalBadges: string[];

  gameStatus: number;
  gameStatusEnum = GameStatus;
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
  account: Account;
  applicationSettings: ApplicationSettings;
  liveErrorMsg = 'Sorry, don\'t have enough life.';
  subscriptions = [];
  userInvitations: { [key: string]: Invitation };
  userCardType = userCardType;
  correctAnswerClassIndexIncrement = 0;
  dialogOpen: Boolean = false;
  openReportDialog: Boolean = false;
  continueButtonClicked(event: any) {
    this.gameOverContinueClicked.emit();
  }

  constructor(public store: Store<AppState>, public userActions: UserActions,
    public utils: Utils, public cd: ChangeDetectorRef) {

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
      }
    }));

    this.subscriptions.push(store.select(appState.coreState).pipe(select(s => s.account)).subscribe(account => {
      this.account = account;
    }));

    this.user$ = this.store.select(appState.coreState).pipe(select(s => s.user));
    this.subscriptions.push(this.user$.subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    }));

    this.socialFeedData = {
      blogNo: 0,
      share_status: false,
      link: this.imageUrl
    };
    this.store.dispatch(new dashboardactions.LoadSocialScoreShareUrlSuccess(null));

    this.subscriptions.push(store.select(appState.coreState).pipe(select(s => s.userDict),
      map(userDict => {
        this.userDict = userDict;
      }),
      flatMap(() => this.store.select(appState.coreState).pipe(select(s => s.userFriendInvitations),
        skipWhile(userInvitations => !(userInvitations && this.game)),
        take(1),
        map(userInvitations => {
          if (this.game && this.userDict[this.otherUserId]) {
            this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
            this.otherUserInfo = this.userDict[this.otherUserId];
            this.cd.markForCheck();
            this.userInvitations = userInvitations;
            if (this.user && this.user.email && !this.userInvitations[this.user.email]) {
              this.store.dispatch(this.userActions.loadUserInvitationsInfo(
                this.user.userId, this.userDict[this.otherUserId].email, this.otherUserId));
            }
          }
        })
      ))).subscribe());

    this.subscriptions.push(this.store.select(gamePlayState).pipe(select(s => s.userAnsweredQuestion)).subscribe(stats => {
      if (stats != null) {
        this.questionsArray = stats;
        this.questionsArray.map((res) => {
          res.openReport = false;
          res.ansStatus = false;
          res.answers.map((response) => {
            if (response.correct && response.answerText === res.userGivenAnswer) {
              this.correctAnswerClassIndexIncrement++;
              let className;
              if (this.game) {
                if (!this.game.gameOptions.isBadgeWithCategory) {
                  className = `score${this.correctAnswerClassIndexIncrement}`;
                } else {
                  className = res.badge && res.badge.name && res.badge.won ? res.badge.name : '';
                }
              }
              res.className = className;
              res.ansStatus = true;
            }
          });
          return res;
        });
        this.cd.markForCheck();
      }
    }));
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.game && changes.game.currentValue) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
      this.game.decideWinner();
      if (this.game.winnerPlayerId && Number(this.game.gameOptions.playerMode) === PlayerMode.Opponent) {
        this.gameStatus = this.game.winnerPlayerId === this.user.userId ? GameStatus.WON :
          (this.game.winnerPlayerId === this.otherUserId ? GameStatus.LOST : -1);
      } else if (Number(this.game.gameOptions.playerMode) === PlayerMode.Single) {
        this.gameStatus = this.game.winnerPlayerId === this.user.userId ? GameStatus.WON : GameStatus.LOST;
      }

      if (!this.game.winnerPlayerId && Number(this.game.gameOptions.playerMode) === PlayerMode.Opponent) {
        if ((!this.game.gameOptions.isBadgeWithCategory &&
          this.game.stats[this.user.userId].score !== this.game.stats[this.otherUserId].score
        ) ||
          (
            this.game.gameOptions.isBadgeWithCategory &&
            this.earnedBadges.length === this.earnedBadgesByOtherUser.length
          )
        ) {
          this.gameStatus = GameStatus.TIE;
        } else if (this.game.round >= 16) {
          this.gameStatus = GameStatus.DRAW;
        }

      }
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

  destroy() {
    this.user$ = undefined;
    this.user = undefined;
    this.otherUserId = undefined;
    this.otherUserInfo = undefined;
    this.questionsArray = [];
    this.socialFeedData = undefined;
    this.imageUrl = undefined;
    this.disableRematchBtn = undefined;
    this.PlayerMode = undefined;
    this.loaderStatus = undefined;
    this.opponentType = undefined;
    this.disableFriendInviteBtn = undefined;
    this.account = undefined;
    this.applicationSettings = undefined;
  }

}
