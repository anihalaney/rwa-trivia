import { Component, OnInit, Inject, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import { PlayerMode, GameStatus } from 'shared-library/shared/model';
import { WindowRef, Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../store';
import { Dashboard } from './dashboard';
import { RouterExtensions } from 'nativescript-angular/router';
import { User } from 'shared-library/shared/model';
import { timer } from 'rxjs';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss']
})
export class DashboardComponent extends Dashboard implements OnInit {

  gameStatus: any;

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
    this.subs.push(this.userDict$.subscribe(userDict => { this.userDict = userDict; }));

  }

  startNewGame() {
    if (this.applicationSettings.lives.enable) {
      if (this.account.lives > 0) {
        this.routerExtension.navigate(['/game-play']);
      }
    } else {
      this.routerExtension.navigate(['/game-play']);
    }

  }

  filterGame(game: any, gameStatus, user: User) {
    // tslint:disable-next-line:max-line-length
    return game.GameStatus === gameStatus.AVAILABLE_FOR_OPPONENT || game.GameStatus === gameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE || game.GameStatus === gameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE;
  }


  filterSinglePlayerGame(game: any, gameStatus, user: User) {
    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Single) && game.playerIds.length === 1;
  }

  filterTwoPlayerGame(game: any, gameStatus, user: User) {

    // tslint:disable-next-line:no-unused-expression

    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Opponent) &&
      (game.nextTurnPlayerId === user.userId);
  }

  filterTwoPlayerWaitNextQGame(game: any, gameStatus, user: User) {
    return game.GameStatus === gameStatus.WAITING_FOR_NEXT_Q;
  }
}


