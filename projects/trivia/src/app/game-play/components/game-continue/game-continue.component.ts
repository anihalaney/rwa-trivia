import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import { AppState } from '../../../store';
import { GameContinue } from './game-continue';

@Component({
  selector: 'game-continue',
  templateUrl: './game-continue.component.html',
  styleUrls: ['./game-continue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class GameContinueComponent extends GameContinue implements OnInit, OnDestroy {

  constructor(public store: Store<AppState>,
    public dialog: MatDialog,
    public userActions: UserActions,
    public utils: Utils,
    public snackBar: MatSnackBar,
    public viewContainerRef: ViewContainerRef,
    public cd: ChangeDetectorRef
  ) {
    super(store, userActions, utils, cd);
  }
  ngOnInit() {
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }
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


  ngOnDestroy() {
    this.utils.unsubscribe(this.subscriptions);
    this.destroy();
  }

}
