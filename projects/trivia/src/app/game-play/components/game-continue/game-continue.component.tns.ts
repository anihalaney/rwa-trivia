import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterExtensions } from 'nativescript-angular/router';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import { AppState } from '../../../store';
import { GameContinue } from './game-continue';
import { FirebaseScreenNameConstants } from 'shared-library/shared/model';

@Component({
  selector: 'game-continue',
  templateUrl: './game-continue.component.html',
  styleUrls: ['./game-continue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class GameContinueComponent extends GameContinue implements OnInit, OnDestroy {
  stackLayout;
  showQuesAndAnswer: Boolean = true;
  constructor(
    public store: Store<AppState>,
    public userActions: UserActions,
    public utils: Utils,
    public cd: ChangeDetectorRef,
    public routerExtensions: RouterExtensions
  ) {
    super(store, userActions, utils, cd);
  }
  ngOnInit() {
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];
    }
  }


  ngOnDestroy() {
    this.destroy();
  }

  stackLoaded(args) {
    this.stackLayout = args.object;
  }

  continueClicked() {
    this.continueButtonClicked.emit();
  }

  gotoDashboard() {
    this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
  }

}
