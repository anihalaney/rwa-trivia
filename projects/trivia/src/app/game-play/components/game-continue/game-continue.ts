import { ChangeDetectorRef, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import { Game, PlayerMode, User, userCardType, ApplicationSettings } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';

export class GameContinue implements OnInit {

  @Output() continueButtonClicked = new EventEmitter();
  @Input() game: Game;
  @Input() userDict: { [key: string]: User };
  @Input() totalRound: number;
  @Input() turnFlag: boolean;
  @Input() threeConsecutiveAnswer: boolean;
  @Input() applicationSettings: ApplicationSettings;
  @Input() otherPlayer: User;
  @Input() earnedBadgesByOtherUser: string[];
  @Input() earnedBadges: string[];
  @Input() totalBadges: string[];
  user$: Observable<User>;
  user: User;
  otherUserId: string;
  otherUserInfo: User;
  PlayerMode = PlayerMode;
  userDict$: Observable<{ [key: string]: User }>;
  playerUserName = '';
  subscriptions = [];
  userCardType = userCardType;

  constructor(
    public store: Store<AppState>,
    public userActions: UserActions,
    public utils: Utils,
    public cd: ChangeDetectorRef
  ) {
    this.user$ = this.store.select(appState.coreState).pipe(select(s => s.user));
    this.subscriptions.push(this.user$.subscribe(user => {
      if (user !== null) {
        this.user = user;
        this.playerUserName = this.user.displayName;
      }
    }));

    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => {
      this.userDict = userDict;
    }));

  }

  ngOnInit() {
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }
  }

  destroy() {
    this.user$ = undefined;
    this.user = undefined;
    this.otherUserId = undefined;
    this.otherUserInfo = undefined;
    this.PlayerMode = undefined;
    this.subscriptions = [];
  }

}
