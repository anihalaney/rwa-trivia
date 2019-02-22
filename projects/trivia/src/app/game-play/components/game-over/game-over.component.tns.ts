import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Utils, WindowRef } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { UserActions } from 'shared-library/core/store/actions';
import { Store, select } from '@ngrx/store';
import { gamePlayState } from '../../store';
import { GameOver } from './game-over';
import { ModalDialogService } from 'nativescript-angular/directives/dialogs';
import { ReportGameComponent } from './../report-game/report-game.component';
import { getImage } from 'nativescript-screenshot';
import * as SocialShare from "nativescript-social-share";
import { Image } from "tns-core-modules/ui/image";
import { coreState } from 'shared-library/core/store';
import * as Toast from 'nativescript-toast';

@Component({
  selector: 'game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent extends GameOver implements OnInit, OnDestroy {

  stackLayout;
  showQuesAndAnswer: Boolean = true;
  constructor(public store: Store<AppState>, public userActions: UserActions,
    private windowRef: WindowRef, public utils: Utils,
    private modal: ModalDialogService, private vcRef: ViewContainerRef) {
    super(store, userActions, utils);

    this.subs.push(this.store.select(gamePlayState).pipe(select(s => s.saveReportQuestion)).subscribe(state => { }));
    this.subs.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe((status: string) => {
      if (status && status !== 'NONE' && status !== 'IN PROCESS' && status !== 'SUCCESS' && status !== 'MAKE FRIEND SUCCESS') {
        Toast.makeText(status).show();
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

  shareScore() {
    this.loaderStatus = true;
    this.playerUserName = this.user.displayName;
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

  openDialog(question) {
    const options = {
      context: { 'question': question, 'user': this.user, 'game': this.game, 'userDict': this.userDict },
      fullscreen: false,
      viewContainerRef: this.vcRef
    };
    this.modal.showModal(ReportGameComponent, options);
  }

  stackLoaded(args) {
    this.stackLayout = args.object;
  }

  reMatchGame() {
    if (this.applicationSettings.lives.enable && this.account.lives === 0) {
      Toast.makeText(this.liveErrorMsg).show();
    } else {
      this.reMatch();
    }
  }

  screenshot() {
    this.playerUserName = this.user.displayName;
    // we need to put setTimeout because to change username before screenshot.
    setTimeout(() => {
      const img = new Image;
      img.imageSource = getImage(this.stackLayout);
      const shareImage = img.imageSource;
      SocialShare.shareImage(shareImage);
      this.playerUserName = 'You';
    }, 100);
  }
}
