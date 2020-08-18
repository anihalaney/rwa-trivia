import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,
  OnInit, Renderer2, ViewContainerRef, Inject, PLATFORM_ID
} from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { select, Store } from '@ngrx/store';
import * as domtoimage from 'dom-to-image';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Utils, WindowRef } from 'shared-library/core/services';
import { coreState } from 'shared-library/core/store';
import { UserActions } from 'shared-library/core/store/actions';
import { appConstants } from 'shared-library/shared/model';
import * as dashboardactions from '../../../dashboard/store/actions';
import { AppState, appState } from '../../../store';
import { gamePlayState } from '../../store';
import { ReportGameComponent } from '../report-game/report-game.component';
import { GameOver } from './game-over';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class GameOverComponent extends GameOver implements OnInit, OnDestroy {

  dialogRef: MatDialogRef<ReportGameComponent>;
  continueButtonClicked(event: any) {
    this.gameOverContinueClicked.emit();
  }

  constructor(public store: Store<AppState>,
    public dialog: MatDialog,
    private renderer: Renderer2,
    public userActions: UserActions,
    @Inject(PLATFORM_ID) private platformId: Object,
    private windowRef: WindowRef,
    public utils: Utils,
    public snackBar: MatSnackBar,
    public viewContainerRef: ViewContainerRef,
    public cd: ChangeDetectorRef
  ) {
    super(store, userActions, utils, cd);
    this.subscriptions.push(this.store.select(gamePlayState).pipe(select(s => s.saveReportQuestion)).subscribe(state => {
      if (state === 'SUCCESS') {
        if ((this.dialogRef)) {
          this.dialogRef.close();
        }
      }
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe((status: string) => {
      if (status && status !== 'NONE' && status !== 'IN PROCESS' && status !== 'SUCCESS' && status !== 'MAKE FRIEND SUCCESS') {
        this.snackBar.open(status, '', {
          viewContainerRef: this.viewContainerRef,
          duration: 2000,
        });
        this.disableFriendInviteBtn = true;
      }
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(appState.dashboardState).pipe(select(s => s.socialShareImageUrl)).subscribe(uploadTask => {
      if (uploadTask != null) {
        if (uploadTask.task.snapshot.state === 'success') {
          const path = uploadTask.task.snapshot.metadata.fullPath.split('/');
          if (isPlatformBrowser(this.platformId)) {
            // tslint:disable-next-line:max-line-length
            const url = `https://${this.windowRef.nativeWindow.location.hostname}/${appConstants.API_VERSION}/game/social/${this.user.userId}/${path[path.length - 1]}`;
            this.socialFeedData.share_status = true;
            this.socialFeedData.link = url;
            this.loaderStatus = false;
          }
        }
      } else {
        this.socialFeedData.share_status = false;
        this.loaderStatus = false;
      }
      this.cd.markForCheck();
    }));
  }
  ngOnInit() {
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }
  }




  reportQuestion(question) {
    setTimeout(() => this.openDialog(question), 0);
  }

  openDialog(question) {
    this.dialogRef = this.dialog.open(ReportGameComponent, {
      disableClose: false,
      data: { 'question': question, 'user': this.user, 'game': this.game, 'userDict': this.userDict }
    });

    this.dialogRef.componentInstance.ref = this.dialogRef;

    this.subscriptions.push(this.dialogRef.afterOpen().subscribe(x => {
      if (isPlatformBrowser(this.platformId)) {
        this.renderer.addClass(document.body, 'dialog-open');
      }
    }));
    this.subscriptions.push(this.dialogRef.afterClosed().subscribe(x => {
      this.dialogRef = null;
    }));
  }

  shareScore() {
    this.loaderStatus = true;
    this.playerUserName = this.user.displayName;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const node = document.getElementById('share-content');
        domtoimage.toPng(node)
          .then((dataUrl) => {
            this.store.dispatch(new dashboardactions.LoadSocialScoreShareUrl({
              imageBlob: this.utils.dataURItoBlob(dataUrl),
              userId: this.user.userId
            }));
            this.playerUserName = 'You';
          })
          .catch((err) => {
            console.log('oops, something went wrong!', err);
          });
      }, 2000);
    }
  }




  onNotify(info: any) {
    this.socialFeedData.share_status = info.share_status;
  }

  reMatchGame() {
    if (this.applicationSettings.lives.enable && this.account.lives === 0) {
      this.snackBar.open(this.liveErrorMsg, '', {
        duration: 2000,
      });
    } else {
      this.reMatch();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

}
