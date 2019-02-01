import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import { Utils, WindowRef } from 'shared-library/core/services';
import { AppState } from '../../store';
import { Dashboard } from './dashboard';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss']
})
export class DashboardComponent extends Dashboard implements OnInit {
  constructor(store: Store<AppState>,
    questionActions: QuestionActions,
    gameActions: GameActions,
    userActions: UserActions, windowRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object,
    utils: Utils,
    ngZone: NgZone,
    ) {
    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId,
      ngZone,
      utils);
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

  displayMoreGames(): void {
    this.gameSliceLastIndex = (this.activeGames.length > (this.gameSliceLastIndex + 8)) ?
      this.gameSliceLastIndex + 8 : this.activeGames.length;
    this.checkCardCountPerRow();
  }

  displayMoreGameInvites(): void {
    this.gameInviteSliceLastIndex = (this.gameInvites.length > (this.gameInviteSliceLastIndex + 3)) ?
      this.gameInviteSliceLastIndex + 3 : this.gameInvites.length;
  }


  checkCardCountPerRow() {
    this.numbers = [];
    if (this.screenWidth > 1000 && this.screenWidth < 1200) {
      this.maxGameCardPerRow = 3;
    } else {
      this.maxGameCardPerRow = 4;
    }
    if (this.activeGames.length > 0) {
      if (this.activeGames.length < this.maxGameCardPerRow) {
        this.missingCardCount = this.maxGameCardPerRow - this.activeGames.length;
        this.numbers = Array(this.missingCardCount).fill(0).map((x, i) => i);
      } else if (this.activeGames.length > this.maxGameCardPerRow && this.activeGames.length <= this.gameSliceLastIndex) {
        const diff = Math.trunc(this.activeGames.length / this.maxGameCardPerRow);
        if (this.activeGames.length % this.maxGameCardPerRow !== 0) {
          this.missingCardCount = (diff + 1) * this.maxGameCardPerRow - this.activeGames.length;
          this.numbers = Array(this.missingCardCount).fill(0).map((x, i) => i);
        }

      }
    }
  }
}


