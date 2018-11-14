import { Component, Input, OnInit, OnDestroy, HostListener, Inject, ChangeDetectorRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import { PlayerMode, GameStatus } from 'shared-library/shared/model';
import { WindowRef } from 'shared-library/core/services';
import { AppState, appState } from '../../store';
import { Dashboard } from './dashboard';
import { RouterExtensions } from 'nativescript-angular/router';

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
    private routerExtension: RouterExtensions
  ) {

    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId);
    this.gameStatus = GameStatus;

  }
  ngOnInit() {

    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subs.push(this.userDict$.subscribe(userDict => {this.userDict = userDict; }));
  }

  startNewGame() {
    this.routerExtension.navigate(['/game-play'], { clearHistory: true });
  }

  filterGame(game: any, gameStatus) {
    // tslint:disable-next-line:max-line-length
    return game.GameStatus === gameStatus.AVAILABLE_FOR_OPPONENT || game.GameStatus === gameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE || game.GameStatus === gameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE;
  }


  filterSinglePlayerGame(game: any, gameStatus) {
    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Single) && game.playerIds.length === 1;
  }

  filterTwoPlyerGame(game: any, gameStatus) {
    return game.gameOptions.playerMode == PlayerMode.Opponent && game.playerIds.length > 1;
  }

  filterTwoPlyerWaitNextQGame(game: any, gameStatus) {
    return game.GameStatus === gameStatus.WAITING_FOR_NEXT_Q;
  }
}


