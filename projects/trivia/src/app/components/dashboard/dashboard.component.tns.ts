import { Component, OnInit, Inject, NgZone, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import { PlayerMode, GameStatus } from 'shared-library/shared/model';
import { WindowRef, Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../store';
import { Dashboard } from './dashboard';
import { RouterExtensions } from 'nativescript-angular/router';
import { User, Game } from 'shared-library/shared/model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';



@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscription' })
export class DashboardComponent extends Dashboard implements OnInit, OnDestroy {

  gameStatus: any;
  subscription = [];

  constructor(public store: Store<AppState>,
    questionActions: QuestionActions,
    gameActions: GameActions,
    userActions: UserActions, windowRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object,
    ngZone: NgZone,
    utils: Utils,
    private routerExtension: RouterExtensions,
  ) {

    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId,
      ngZone,
      utils);
    this.gameStatus = GameStatus;

  }

  ngOnInit() {

    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscription.push(this.userDict$.subscribe(userDict => { this.userDict = userDict; }));

  }

  startNewGame() {
    if (this.applicationSettings && this.applicationSettings.lives.enable) {
      if (this.account.lives > 0) {
        this.routerExtension.navigate(['/game-play']);
      }
    } else {
      this.routerExtension.navigate(['/game-play']);
    }

  }

  filterGame(game: Game) {
    return game.GameStatus === GameStatus.AVAILABLE_FOR_OPPONENT ||
    game.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE
    || game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE;
  }


  filterSinglePlayerGame(game: Game) {
    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Single) && game.playerIds.length === 1;
  }

  filterTwoPlayerGame(game: Game, user: User) {
    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Opponent) &&
      (game.nextTurnPlayerId === user.userId);
  }

  filterTwoPlayerWaitNextQGame(game: Game) {
    return game.GameStatus === GameStatus.WAITING_FOR_NEXT_Q;
  }

  ngOnDestroy(): void {
  }
}


