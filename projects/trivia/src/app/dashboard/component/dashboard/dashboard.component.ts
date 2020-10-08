import { Component, OnInit, Inject, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import { Utils, WindowRef } from 'shared-library/core/services';
import { AppState } from '../../../store';
import { Dashboard } from './dashboard';
import { Router } from '@angular/router';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends Dashboard implements OnInit {
  constructor(store: Store<AppState>,
    questionActions: QuestionActions,
    gameActions: GameActions,
    userActions: UserActions, windowRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object,
    utils: Utils,
    ngZone: NgZone,
    cd: ChangeDetectorRef,
    public router: Router
  ) {
    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId,
      ngZone,
      utils,
      cd);
  }


  ngOnInit() {
    this.now = new Date();
    const hourOfDay = this.now.getHours();
    if (hourOfDay < 12) {
      this.greeting = 'Morning';
      this.message = 'Nice to see you again,are you ready for a new challenge!';
    } else if (hourOfDay < 17) {
      this.greeting = 'Afternoon';
      this.message = 'Caught you napping? Jog your mind with a new challenge!';
    } else {
      this.greeting = 'Evening';
      this.message = 'Relax your mind. Spice it up with a new game!';
    }
  }

  startNewGame(mode: string) {
    if (this.applicationSettings && this.applicationSettings.lives.enable) {
      if (this.account && this.account.lives > 0) {
        this.router.navigate(['/game-play/game-options', mode]);
      } else if (!this.account) {
        this.router.navigate(['/game-play/game-options', mode]);
      }
    } else {
      this.router.navigate(['/game-play/game-options', mode]);
    }

  }
}
