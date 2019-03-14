import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as gameplayactions from '../../store/actions';
import { GamePlayState } from '../../store';
import { GameActions, UserActions } from 'shared-library/core/store/actions';
import { Utils } from 'shared-library/core/services';
import { GameDialog } from './game-dialog';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscription' })
export class GameDialogComponent extends GameDialog implements OnDestroy {
  constructor(public store: Store<GamePlayState>, public gameActions: GameActions, public router: Router,
    public userActions: UserActions, public utils: Utils, public cd: ChangeDetectorRef) {
    super(store, userActions, utils, cd);
  }

  continueClicked($event) {
    this.currentQuestion = undefined;
    this.originalAnswers = undefined;
    if (this.turnFlag) {
      this.continueNext = false;
      this.store.dispatch(new gameplayactions.ResetCurrentGame());
      this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
      this.store.dispatch(new gameplayactions.UpdateGameRound(this.game.gameId));
      this.router.navigate(['/dashboard']);
    } else {
      this.questionAnswered = false;
      this.showContinueBtn = false;
      this.continueNext = false;
      this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
      this.checkGameOver();
      if (!this.gameOver) {
        this.getLoader();
        this.getNextQuestion();
      }
    }
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    this.store.dispatch(new gameplayactions.ResetCurrentGame());
  }

  // Hide menu if question display
  get isDispayMenu() {
    if (this.currentQuestion && this.showContinueBtn) {
      return undefined;
    }
    if (this.currentQuestion && !this.showLoader && !this.showBadge) {
      return true;
    }
    return undefined;
  }
}
