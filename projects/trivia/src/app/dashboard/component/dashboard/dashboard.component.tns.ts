import { Component, OnInit, Inject, NgZone, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import { PlayerMode, GameStatus } from 'shared-library/shared/model';
import { WindowRef, Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { Dashboard } from './dashboard';
import { RouterExtensions } from 'nativescript-angular/router';
import { User, Game } from 'shared-library/shared/model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Page } from 'tns-core-modules/ui/page/page';



@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class DashboardComponent extends Dashboard implements OnInit, OnDestroy {

  gameStatus: any;
  subscriptions = [];
  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;


  constructor(public store: Store<AppState>,
    questionActions: QuestionActions,
    gameActions: GameActions,
    userActions: UserActions, windowRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object,
    ngZone: NgZone,
    utils: Utils,
    cd: ChangeDetectorRef,
    private routerExtension: RouterExtensions,
    private page: Page
  ) {

    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId,
      ngZone,
      utils,
      cd);
    this.gameStatus = GameStatus;

  }

  ngOnInit() {

    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => { this.userDict = userDict; this.cd.markForCheck(); }));
    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
    }
    ));
  }

  startNewGame() {
    if (this.applicationSettings && this.applicationSettings.lives.enable) {
      if (this.account.lives > 0) {
        this.routerExtension.navigate(['/game-play'], { clearHistory: true });
      }
    } else {
      this.routerExtension.navigate(['/game-play'], { clearHistory: true });
    }

  }

  filterGame(game: Game): boolean {
    return game.GameStatus === GameStatus.AVAILABLE_FOR_OPPONENT ||
      game.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE
      || game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE;
  }


  filterSinglePlayerGame(game: Game): boolean {
    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Single) && game.playerIds.length === 1;
  }

  filterTwoPlayerGame = (game: Game): boolean => {
    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Opponent) &&
      (game.nextTurnPlayerId === this.user.userId);
  }

  filterTwoPlayerWaitNextQGame(game: Game): boolean {
    return game.GameStatus === GameStatus.WAITING_FOR_NEXT_Q;
  }

  ngOnDestroy(): void {
    this.page.off('loaded');
  }
}


