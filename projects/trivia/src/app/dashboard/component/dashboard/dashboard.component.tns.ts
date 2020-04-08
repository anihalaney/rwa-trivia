import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Utils, WindowRef } from 'shared-library/core/services';
import { GameActions, QuestionActions, UserActions } from 'shared-library/core/store/actions';
import { GameStatus } from 'shared-library/shared/model';
import { Page } from 'tns-core-modules/ui/page/page';
import { AppState, appState } from '../../../store';
import { Dashboard } from './dashboard';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class DashboardComponent extends Dashboard implements OnInit, OnDestroy {

  gameStatus: any;
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
    this.page.actionBarHidden = true;

  }

  ngOnInit() {
    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => { this.renderView = true; this.cd.markForCheck(); });
    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => { this.userDict = userDict; this.cd.markForCheck(); }));
  }

  startNewGame(mode: string) {

    if (this.applicationSettings && this.applicationSettings.lives.enable) {
      if (this.account && this.account.lives > 0) {
        this.routerExtension.navigate(['/game-play/game-options', mode], { clearHistory: true });
      } else if (!this.account) {
        this.routerExtension.navigate(['/game-play/game-options', mode], { clearHistory: true });
      }
    } else {
      this.routerExtension.navigate(['/game-play/game-options', mode]);
    }

  }

  navigateToMyQuestion() {
    this.routerExtension.navigate(['/user/my/questions/add']);
  }

  gotToNotification() {
    this.routerExtension.navigate(['/notification']);
  }

  navigateToProfileSettings() {
    if (this.user && this.user !== null) {
       this.routerExtension.navigate(['/user/my/profile', this.user.userId]);
    }
  }

  navigateToCategories() {
    if (this.user && this.user !== null) {
      this.routerExtension.navigate(['/update-category-tag']);
      // this.routerExtension.navigate(['/user/my/profile', this.user.userId]);
    } else {
      this.routerExtension.navigate(['/login'], { clearHistory: true });
    }
  }

  ngOnDestroy(): void {
    this.page.off('loaded');
    this.renderView = false;
    this.cd.markForCheck();
  }
}
