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
import { Page } from 'tns-core-modules/ui/page/page';


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
  hideActionBar: boolean;

  constructor(public store: Store<GamePlayState>, public gameActions: GameActions, public router: Router,
    public userActions: UserActions, public utils: Utils, public cd: ChangeDetectorRef, private page: Page) {
    super(store, userActions, utils, cd, router);
    this.registerLifeCycleEvent();
    this.page.actionBarHidden = true;
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
    this.continueGame();
    this.cd.markForCheck();
  }

  updateActionBarStatus(flag: boolean) {
    this.hideActionBar = true;
  }

  ngOnDestroy() {
    applicationOff(resumeEvent, this.resumeCallBack);
    applicationOff(suspendEvent, this.suspendCallBack);
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
