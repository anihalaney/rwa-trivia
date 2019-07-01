import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as gameplayactions from '../../store/actions';
import { GamePlayState } from '../../store';
import { GameActions, UserActions } from 'shared-library/core/store/actions';
import { Utils } from 'shared-library/core/services';
import { GameDialog } from './game-dialog';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { FirebaseScreenNameConstants } from 'shared-library/shared/model';

import {
  resumeEvent, suspendEvent, ApplicationEventData,
  on as applicationOn, off as applicationOff,
} from 'tns-core-modules/application';


@Component({
  selector: 'game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class GameDialogComponent extends GameDialog implements OnDestroy {

  suspendTime: number;
  resumeTime: number;
  constructor(public store: Store<GamePlayState>, public gameActions: GameActions, public router: Router,
    public userActions: UserActions, public utils: Utils, public cd: ChangeDetectorRef) {
    super(store, userActions, utils, cd);
    this.registerLifeCycleEvent();
    this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.GAME_DIALOG);
  }

  resumeCallBack(args: ApplicationEventData) {
    if (args.ios) {
      this.resumeTime = this.utils.getUTCTimeStamp();
      const remainTime = Math.round((this.resumeTime - this.suspendTime) / 1000);
      if ((this.timer - remainTime) < 0) {
        this.timer = 0;
        this.utils.unsubscribe([this.timerSub]);
        this.fillTimer();
      } else {
        this.timer = (this.timer - remainTime);
      }
    }
  }

  suspendCallBack(args: ApplicationEventData) {
    this.suspendTime = this.utils.getUTCTimeStamp();
  }

  registerLifeCycleEvent(): any {
    applicationOff(resumeEvent, this.resumeCallBack);
    applicationOff(suspendEvent, this.suspendCallBack);

    applicationOn(resumeEvent, this.resumeCallBack, this);
    applicationOn(suspendEvent, this.suspendCallBack, this);

  }


  continueClicked($event) {
    this.currentQuestion = undefined;
    this.originalAnswers = undefined;
    if (this.turnFlag) {
      this.continueNext = false;
      this.store.dispatch(new gameplayactions.ResetCurrentGame());
      this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
      this.store.dispatch(new gameplayactions.UpdateGameRound(this.game.gameId));
      this.navigateToDashboard();
    } else {
      this.questionAnswered = false;
      this.showContinueBtn = false;
      this.continueNext = false;
      this.store.dispatch(new gameplayactions.ResetCurrentQuestion());
      this.checkGameOver();
      if (!this.gameOver) {
        this.getLoader(false);
      }
    }
    this.cd.markForCheck();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    applicationOff(resumeEvent, this.resumeCallBack);
    applicationOff(suspendEvent, this.suspendCallBack);
    this.store.dispatch(new gameplayactions.ResetCurrentGame());
    this.utils.unsubscribe([this.timerSub, this.questionSub]);
    this.destroy();
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
