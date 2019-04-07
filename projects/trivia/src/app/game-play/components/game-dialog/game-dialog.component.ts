import { Component, Inject, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import * as gameplayactions from '../../store/actions';
import { GamePlayState } from '../../store';
import { UserActions } from 'shared-library/core/store/actions';
import { GameDialog } from './game-dialog';
import { Utils } from 'shared-library/core/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
@Component({
  selector: 'game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class GameDialogComponent extends GameDialog implements OnDestroy {

  constructor(public store: Store<GamePlayState>, private router: Router,
    public userActions: UserActions,
    @Inject(MAT_DIALOG_DATA) public data: any, public utils: Utils, public cd: ChangeDetectorRef) {
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
      if (this.showLoader) {
        this.cd.markForCheck();
      }
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new gameplayactions.ResetCurrentGame());
    this.utils.unsubscribe([this.timerSub, this.questionSub]);
    this.destroy();
  }
}
