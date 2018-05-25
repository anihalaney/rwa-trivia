import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { User, Game, PlayerMode } from '../../../model';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../store';
import * as gameplayactions from '../../store/actions';
import { gameplayState } from '../../store';
import * as html2canvas from 'html2canvas';
import { ReportGameComponent } from '../report-game/report-game.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Utils } from '../../../core/services';
import * as domtoimage from 'dom-to-image';


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
  user$: Observable<User>;
  user: User;
  otherUserId: string;
  otherUserInfo: User;
  questionsArray = [];
  dialogRef: MatDialogRef<ReportGameComponent>;
  blogData = [];
  imageUrl = '';
  disableRematchBtn = false;
  PlayerMode = PlayerMode;

  continueButtonClicked(event: any) {
    this.gameOverContinueClicked.emit();
  }

  constructor(private store: Store<AppState>, public dialog: MatDialog, private renderer: Renderer2) {
    this.user$ = this.store.select(appState.coreState).select(s => s.user);
    this.user$.subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    });

    this.store.select(gameplayState).select(s => s.userAnsweredQuestion).subscribe(stats => {
      if (stats != null) {
        this.questionsArray = stats;
      }
    });

    this.store.select(gameplayState).select(s => s.saveReportQuestion).subscribe(state => {
      if (state === 'SUCCESS') {
        (this.dialogRef) ? this.dialogRef.close() : '';
      }
    });
  }
  ngOnInit() {
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }
    this.blogData = [{
      blogNo: 0,
      status: false,
      link: this.imageUrl
    }];
  }
  bindQuestions() {
    if (this.questionsArray.length === 0) {
      this.store.dispatch(new gameplayactions.GetUsersAnsweredQuestion({ userId: this.user.userId, game: this.game }));
    }
  }

  reMatch() {
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
      data: { 'question': question, 'user': this.user, 'game': this.game }
    });

    this.dialogRef.afterOpen().subscribe(x => {
      this.renderer.addClass(document.body, 'dialog-open');
    });
    this.dialogRef.afterClosed().subscribe(x => {
      this.renderer.removeClass(document.body, 'dialog-open');
    });
  }
  shareScore() {
    this.blogData[0].status = true;
    // this.blogData[0].link="https://rwa-trivia-dev-e57fc.firebaseapp.com/dashboard";

    const node = document.getElementById('share-content');

    domtoimage.toPng(node)
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        console.log("url---->" + JSON.stringify(img.src));

        // var a = document.createElement('a');
        // a.href = img.src;
        // a.download = "score.png";
        // document.body.appendChild(a);
        // a.click();
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      });
    // html2canvas(document.querySelector('.share-content')).then((canvas) => {
    //   const context = canvas.getContext('2d');
    //   if (Number(this.game.gameOptions.playerMode) === 0) {
    //     const img = document.getElementById('yourImage');
    //     this.roundedImage(365, 58, 70, 60, 40, context);
    //     context.clip();
    //     context.drawImage(img, 365, 58, 70, 60);
    //   }

    //   if (Number(this.game.gameOptions.playerMode) === 1) {

    //     const sources = {
    //       your: 'http://localhost:4200/assets/images/avatar.jpg',
    //       other: 'http://localhost:4200/assets/images/avatar.png'
    //     };


    //     this.loadImages(sources, function (images, index) {
    //       context.drawImage(images.your, 265, 58, 70, 60);
    //       context.drawImage(images.other, 465, 58, 70, 60);
    //       document.body.appendChild(canvas);
    //       const imageUrl = canvas.toDataURL();
    //       console.log("url--->" + JSON.stringify(imageUrl));
    //     });


    //     //   let isRoundedFirst = false;
    //     //   let isRoundedSecond = false;

    //     //   const img = document.getElementById('yourImage');
    //     //   isRoundedFirst = this.roundedImage(265, 58, 70, 60, 40, context);
    //     //   context.clip();
    //     //   context.drawImage(img, 265, 58, 70, 60);

    //     //   if (isRoundedFirst) {
    //     //     const otherImg = document.getElementById('otherUserImage');
    //     //     isRoundedSecond = this.roundedImage(465, 58, 70, 60, 40, context);
    //     //     context.clip();
    //     //     context.drawImage(otherImg, 465, 58, 70, 60);
    //     //   }

    //     //   if (isRoundedFirst && isRoundedSecond) {
    //     //     document.body.appendChild(canvas);
    //     //     this.imageUrl = canvas.toDataURL('image/jpg');
    //     //     this.blogData[0].link = this.imageUrl;
    //     //     this.blogData[0].stats = true;
    //     //     console.log(JSON.stringify(this.imageUrl));
    //     //   }
    //     // }
    //   }
    // });
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
    this.blogData[0].status = info.status;
  }
}
