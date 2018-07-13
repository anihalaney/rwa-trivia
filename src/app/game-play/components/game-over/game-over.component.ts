import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { User, Game, PlayerMode } from '../../../model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { AppState, appState } from '../../../store';
import * as gameplayactions from '../../store/actions';
import * as socialactions from '../../../social/store/actions';
import { gameplayState } from '../../store';
import { ReportGameComponent } from '../report-game/report-game.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Utils } from '../../../core/services';
import * as domtoimage from 'dom-to-image';
import { UserActions } from '../../../core/store/actions';
import { CONFIG } from '../../../../environments/environment';


@Component({
  selector: 'game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {
  @Input() correctCount: number;
  @Input() noOfQuestions: number;
  @Output() gameOverContinueClicked = new EventEmitter();
  @Output() viewQuestionClicked = new EventEmitter<any>();
  @Input() categoryName: string;
  @Input() game: Game;
  @Input() userDict: { [key: string]: User };
  @Input() totalRound: number;
  user$: Observable<User>;
  user: User;
  otherUserId: string;
  otherUserInfo: User;
  questionsArray = [];
  dialogRef: MatDialogRef<ReportGameComponent>;
  blogData;
  imageUrl = '';
  disableRematchBtn = false;
  PlayerMode = PlayerMode;
  userDict$: Observable<{ [key: string]: User }>;
  loaderStatus = false;
  playerUserName = 'You';

  continueButtonClicked(event: any) {
    this.gameOverContinueClicked.emit();
  }

  constructor(private store: Store<AppState>, public dialog: MatDialog, private renderer: Renderer2, private userActions: UserActions) {

    this.user$ = this.store.select(appState.coreState).pipe(select(s => s.user));
    this.user$.subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    });
    this.blogData = [];
    this.blogData = [{
      blogNo: 0,
      share_status: false,
      link: this.imageUrl
    }];
    this.store.dispatch(new socialactions.LoadSocialScoreShareUrlSuccess(null));

    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.userDict$.subscribe(userDict => {
      this.userDict = userDict
    });

    this.store.select(gameplayState).pipe(select(s => s.userAnsweredQuestion)).subscribe(stats => {
      if (stats != null) {
        this.questionsArray = stats;
        this.questionsArray.map((question) => {
          if (!this.userDict[question.created_uid]) {
            this.store.dispatch(this.userActions.loadOtherUserProfile(question.created_uid));
          }
        })
      }
    });

    this.store.select(gameplayState).pipe(select(s => s.saveReportQuestion)).subscribe(state => {
      if (state === 'SUCCESS') {
        (this.dialogRef) ? this.dialogRef.close() : '';
      }
    });

    this.store.select(appState.socialState).pipe(select(s => s.socialShareImageUrl)).subscribe(uploadTask => {
      if (uploadTask != null) {
        if (uploadTask.task.snapshot.state === 'success') {
          const path = uploadTask.task.snapshot.metadata.fullPath.split('/');
          const url = `${CONFIG.functionsUrl}/app/game/social/${this.user.userId}/${path[path.length - 1]}`;
          this.blogData[0].share_status = true;
          this.blogData[0].link = url;
          console.log('url---->', url);
          this.loaderStatus = false;
        }
      } else {
        this.blogData[0].share_status = false;
        this.loaderStatus = false;
      }
    });
  }
  ngOnInit() {
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }

  }
  bindQuestions() {
    if (this.questionsArray.length === 0) {
      this.store.dispatch(new gameplayactions.GetUsersAnsweredQuestion({ userId: this.user.userId, game: this.game }));
    }
  }

  reMatch() {
    this.blogData[0].share_status = false;
    this.disableRematchBtn = true;
    this.game.gameOptions.rematch = true;
    if (this.game.playerIds.length > 0) {
      this.game.gameOptions.friendId = this.game.playerIds.filter(playerId => playerId !== this.user.userId)[0];
    }
    this.store.dispatch(new gameplayactions.CreateNewGame({ gameOptions: this.game.gameOptions, user: this.user }));
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
            imageBlob: Utils.dataURItoBlob(dataUrl, 'png'),
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
    this.blogData[0].share_status = info.share_status;
  }
}
