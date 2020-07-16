import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ModalDialogService } from 'nativescript-angular/directives/dialogs';
import { RouterExtensions } from 'nativescript-angular/router';
import { getImage } from 'nativescript-screenshot';
import * as SocialShare from 'nativescript-social-share';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { WindowRef, Utils } from 'shared-library/core/services';
import { coreState } from 'shared-library/core/store';
import { UserActions } from 'shared-library/core/store/actions';
import { AppState, appState } from '../../../store';
import { gamePlayState } from '../../store';
import { GameOver } from './game-over';
import { Image } from 'tns-core-modules/ui/image';
import { appConstants } from 'shared-library/shared/model';
import { Question } from '../../../../../../shared-library/src/lib/shared/model';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class GameOverComponent extends GameOver implements OnInit, OnDestroy {

  actionBarStatus: String = 'Game Result';
  isDispayMenu = false;
  stackLayout;
  showQuesAndAnswer: Boolean = true;
  renderView = false;
  reportQuestion: Question;
  stackBackgroundColor = '';
  isScreenShot = false;
  constructor(public store: Store<AppState>, public userActions: UserActions,
    private windowRef: WindowRef, public utils: Utils,
    private modal: ModalDialogService, private vcRef: ViewContainerRef,
    public cd: ChangeDetectorRef, private routerExtensions: RouterExtensions, private page: Page) {
    super(store, userActions, utils, cd);
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
    this.subscriptions.push(this.store.select(gamePlayState).pipe(select(s => s.saveReportQuestion)).subscribe(state => {
      this.cd.markForCheck();
    }));
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe((status: string) => {
      if (status && status !== 'NONE' && status !== 'IN PROCESS' && status !== 'SUCCESS' && status !== 'MAKE FRIEND SUCCESS') {
        this.utils.showMessage('success', status);
        this.disableFriendInviteBtn = true;
      }
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(appState.dashboardState).pipe(select(s => s.socialShareImageUrl)).subscribe(uploadTask => {
      if (uploadTask != null) {
        if (uploadTask.task.snapshot.state === 'success') {
          const path = uploadTask.task.snapshot.metadata.fullPath.split('/');
          // tslint:disable-next-line:max-line-length
          const url = `https://${this.windowRef.nativeWindow.location.hostname}/${appConstants.API_VERSION}/game/social/${this.user.userId}/${path[path.length - 1]}`;
          this.socialFeedData.share_status = true;
          this.socialFeedData.link = url;
          this.loaderStatus = false;
        }
      } else {
        this.socialFeedData.share_status = false;
        this.loaderStatus = false;
      }
      this.cd.markForCheck();
    }));

    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }
  }

  preventEventPropogation() {

  }

  shareScore() {
    this.loaderStatus = true;
    this.playerUserName = this.user.displayName;
  }

  ngOnDestroy() {
    this.destroy();
  }

  showDialog() {
    this.dialogOpen = true;
  }

  closeDialog() {
    this.dialogOpen = false;
  }

  closeDialogReport(closePopUp) {
    this.openReportDialog = closePopUp;
    this.handlePopOver();
  }

  openDialogReport(question) {
    this.reportQuestion = new Question();
    this.reportQuestion = question;
    this.openReportDialog = true;
  }

  handlePopOver(row?) {
    this.questionsArray.map((res) => {
      const checkIfIDExist = row && row.id;
      if (checkIfIDExist && res.id === row.id) {
        res.openReport = !res.openReport;
      } else {
        res.openReport = false;
      }
    });
  }

  openDialog(question) {
    this.handlePopOver(question);
  }

  stackLoaded(args) {
    this.stackLayout = args.object;
  }

  reMatchGame() {
    if (this.applicationSettings.lives.enable && this.account.lives === 0) {
      this.utils.showMessage('error', this.liveErrorMsg);
    } else {
      this.page.actionBarHidden = true;
      this.reMatch();
    }
  }

  screenshot() {
    this.playerUserName = this.user.displayName;
    this.stackBackgroundColor = '#ffffff';
    this.isScreenShot = true;
    // we need to put setTimeout because to change username before screenshot.
    setTimeout(() => {
      const img = new Image;
      this.isScreenShot = false;
      img.imageSource = getImage(this.stackLayout);
      const shareImage = img.imageSource;
      SocialShare.shareImage(shareImage);
      this.playerUserName = 'You';
      this.stackBackgroundColor = '';
      this.cd.markForCheck();
    }, 100);
  }

  gotoDashboard() {
    this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
  }
}
