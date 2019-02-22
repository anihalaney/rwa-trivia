import { Component, OnInit, OnDestroy, Renderer2, ViewContainerRef } from '@angular/core';
import { Utils, WindowRef } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { UserActions } from 'shared-library/core/store/actions';
import { Store, select } from '@ngrx/store';
import * as socialactions from '../../../social/store/actions';
import { gamePlayState } from '../../store';
import { ReportGameComponent } from '../report-game/report-game.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import * as domtoimage from 'dom-to-image';
import { GameOver } from './game-over';
import { coreState } from 'shared-library/core/store';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})

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
  ) {
    super(store, userActions, utils);
    this.subs.push(this.store.select(gamePlayState).pipe(select(s => s.saveReportQuestion)).subscribe(state => {
      if (state === 'SUCCESS') {
        if ((this.dialogRef)) {
          this.dialogRef.close();
        }
      }
    }));

    this.subs.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe((status: string) => {
      if (status && status !== 'NONE' && status !== 'IN PROCESS' && status !== 'SUCCESS' && status !== 'MAKE FRIEND SUCCESS') {
        this.snackBar.open(status, '', {
          viewContainerRef: this.viewContainerRef,
          duration: 2000,
        });
        this.disableFriendInviteBtn = true;
      }
    }));

    this.subs.push(this.store.select(appState.socialState).pipe(select(s => s.socialShareImageUrl)).subscribe(uploadTask => {
      if (uploadTask != null) {
        if (uploadTask.task.snapshot.state === 'success') {
          const path = uploadTask.task.snapshot.metadata.fullPath.split('/');
          // tslint:disable-next-line:max-line-length
          const url = `https://${this.windowRef.nativeWindow.location.hostname}/app/game/social/${this.user.userId}/${path[path.length - 1]}`;
          this.socialFeedData.share_status = true;
          this.socialFeedData.link = url;
          this.loaderStatus = false;
        }
      } else {
        this.socialFeedData.share_status = false;
        this.loaderStatus = false;
      }
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

    this.dialogRef.afterOpen().subscribe(x => {
      this.renderer.addClass(document.body, 'dialog-open');
    });
    this.dialogRef.afterClosed().subscribe(x => {
      this.dialogRef = null;
    });
  }

  shareScore() {
    this.loaderStatus = true;
    this.playerUserName = this.user.displayName;
    setTimeout(() => {
      const node = document.getElementById('share-content');
      domtoimage.toPng(node)
        .then((dataUrl) => {
          this.store.dispatch(new socialactions.LoadSocialScoreShareUrl({
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

    for (let src in sources) {
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
    this.utils.unsubscribe(this.subs);
  }

}
