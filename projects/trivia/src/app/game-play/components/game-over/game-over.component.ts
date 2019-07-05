import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { select, Store } from '@ngrx/store';
import * as domtoimage from 'dom-to-image';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Utils, WindowRef } from 'shared-library/core/services';
import { coreState } from 'shared-library/core/store';
import { UserActions } from 'shared-library/core/store/actions';
import * as dashboardactions from '../../../dashboard/store/actions';
import { AppState, appState } from '../../../store';
import { gamePlayState } from '../../store';
import { ReportGameComponent } from '../report-game/report-game.component';
import { GameOver } from './game-over';
import {
  appConstants, FirebaseAnalyticsKeyConstants,
  OpponentType, GameConstants, GameMode,
  FirebaseAnalyticsEventConstants, PlayerMode, GeneralConstants
} from 'shared-library/shared/model';

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
  }
  ngOnInit() {
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
      this.pushAnalyticsData();
    }
  }

  pushAnalyticsData() {
    if (this.windowRef.isDataLayerAvailable()) {
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.GAME_ID, this.game.gameId);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.USER_ID, this.user.userId);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.PLAYER_MODE,
        this.game.gameOptions.playerMode === PlayerMode.Single ? GameConstants.SINGLE : GameConstants.OPPONENT);

      if (this.game.gameOptions.playerMode === PlayerMode.Opponent) {
        this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.OPPONENT_TYPE,
          this.game.gameOptions.opponentType === OpponentType.Random ? GameConstants.RANDOM : GameConstants.FRIEND);
        this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.OTHER_USER_ID, this.otherUserId);
        this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.OTHER_USER_SCORE,
          this.game.stats[this.otherUserId].score.toString());

        if (this.game.round < 16 && this.game.stats[this.user.userId].score === this.game.stats[this.otherUserId].score) {
          this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.IS_TIE, GeneralConstants.TRUE);
        } else {
          let winPlayerId = this.otherUserId;
          if (this.game.round < 16 && this.game.stats[this.user.userId].score > this.game.stats[this.otherUserId].score) {
            winPlayerId = this.user.userId;
          }
          this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.WINNER_PLAYER_ID, winPlayerId);
        }

      } else {
        this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.GAME_STATUS,
          (this.game.playerQnAs.length - this.game.stats[this.user.userId].score !== 4) ? GeneralConstants.WIN : GeneralConstants.LOST);
      }

      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.USER_SCORE,
        this.game.stats[this.user.userId].score.toString());
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.GAME_MODE,
        this.game.gameOptions.gameMode === GameMode.Normal ? GameConstants.NORMAL : GameConstants.OFFLINE);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.CATEGORY_IDS, JSON.stringify(this.game.gameOptions.categoryIds));
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.TAGS, JSON.stringify(this.game.gameOptions.tags));
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.ROUND, this.game.round.toString());
      this.windowRef.pushAnalyticsEvents(FirebaseAnalyticsEventConstants.COMPLETED_GAME);
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
      this.renderer.addClass(document.body, 'dialog-open');
    }));
    this.subscriptions.push(this.dialogRef.afterClosed().subscribe(x => {
      this.dialogRef = null;
    }));
  }

  shareScore() {
    this.loaderStatus = true;
    this.playerUserName = this.user.displayName;
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
        .catch((error) => {
          console.error('oops, something went wrong!', error);
        });
    }, 2000);

  }

  loadImages(sources, callback) {
    const images = {};
    let loadedImages = 0;
    let numImages = 0;
    // get num of sources
    for (const key in sources) {
      if (sources.hasOwnProperty(key)) {
        numImages++;
      }
    }

    for (const src in sources) {
      if (sources.hasOwnProperty(src)) {
        images[src] = new Image();
        images[src].onload = () => {
          if (++loadedImages >= numImages) {
            callback(images);
          }
        };
        images[src].src = sources[src];


      }
    }
  }

  roundedImage(x, y, width, height, radius, context) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    return true;
  }

  onNotify(info: any) {
    this.socialFeedData.share_status = info.share_status;
  }

  reMatchGame() {
    if (this.applicationSettings.lives.enable && this.account.lives === 0) {
      this.snackBar.open(this.liveErrorMsg, '', {
        viewContainerRef: this.viewContainerRef,
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
