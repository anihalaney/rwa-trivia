import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Utils, WindowRef } from 'shared-library/core/services';
import { GameActions, QuestionActions, UserActions } from 'shared-library/core/store/actions';
import { FirebaseScreenNameConstants, Game, GameStatus, PlayerMode } from 'shared-library/shared/model';
import { Page } from 'tns-core-modules/ui/page/page';
import { AppState, appState } from '../../../store';
import { Dashboard } from './dashboard';

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
    this.page.on('loaded', () => { this.renderView = true; this.cd.markForCheck(); });
  }

  startNewGame(mode: string) {

    if (this.applicationSettings && this.applicationSettings.lives.enable) {
      if (this.account && this.account.lives > 0) {
        console.log('mode::', mode);
        this.routerExtension.navigate(['/game-play/game-options', mode], { clearHistory: true });
      } else if (!this.account) {
        this.routerExtension.navigate(['/game-play/game-options', mode], { clearHistory: true });
      }
    } else {
      this.routerExtension.navigate(['/game-play/game-options', mode]);
    }

  }

  filterGame(game: Game): boolean {
    return game.GameStatus === GameStatus.AVAILABLE_FOR_OPPONENT ||
      game.GameStatus === GameStatus.JOINED_GAME ||
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

  filterTwoPlayerWaitNextQGame = (game: Game): boolean => {
    return game.GameStatus === GameStatus.WAITING_FOR_NEXT_Q && game.nextTurnPlayerId !== this.user.userId;
  }

  navigateToLogin(): void {
    this.routerExtension.navigate(['/login'], { clearHistory: true });
  }

  navigateToMyQuestion() {
    this.routerExtension.navigate(['/user/my/questions']);
  }

  ngOnDestroy(): void {
    this.page.off('loaded');
    this.renderView = false;
  }
}


