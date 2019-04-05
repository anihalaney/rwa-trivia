import { Component, OnInit, Inject, NgZone, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import { PlayerMode, GameStatus } from 'shared-library/shared/model';
import { WindowRef, Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { Dashboard } from './dashboard';
import { RouterExtensions } from 'nativescript-angular/router';
import { User, Game } from 'shared-library/shared/model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Page } from 'tns-core-modules/ui/page/page';
import { Color } from "tns-core-modules/color";
import { Label } from "tns-core-modules/ui/label";
import * as enums from "tns-core-modules/ui/enums";
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout/stack-layout';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class DashboardComponent extends Dashboard implements OnInit, OnDestroy {

  gameStatus: any;
  subscriptions = [];
  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;
  CGSizeMake: any;
  @ViewChild('label') newLable: ElementRef;
  @ViewChild('stacklayout') newstack: ElementRef;

  // animate(label: Label) {
  //   const backgrundCol = String(label.backgroundColor);
  //   label.animate({
  //     opacity: 0.50,
  //     backgroundColor: new Color(backgrundCol),
  //     duration: 350,
  //     delay: 2,
  //     iterations: 1,
  //     curve: enums.AnimationCurve.easeOut
  //   }).then(() => {
  //     label.animate({
  //       opacity: 1,
  //       backgroundColor: new Color(backgrundCol),
  //     });
  //   }).catch((e) => {
  //     console.log(e.message);
  //   });
  // }

  colorLuminance(col, amt) {

    let usePound = false;

    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }


  async animate(label: Label) {
    const backgrundCol = String(label.backgroundColor);
    console.log('background color ', backgrundCol);
    console.log(this.colorLuminance(backgrundCol, 20));
    console.log('background color ', backgrundCol);
    const newColor1 = this.colorLuminance(backgrundCol, 15);
    const newColor2 = this.colorLuminance(backgrundCol, 10);
    const newColor3 = this.colorLuminance(backgrundCol, 5);

    label.animate({
      opacity: .80,
      backgroundColor: new Color(newColor3),
      duration: 300,
      delay: 2,
      iterations: 1,
      curve: enums.AnimationCurve.easeOut
    }).then(() => {
      label.animate({
        opacity: .80,
        backgroundColor: new Color(newColor2),
        duration: 300,
        delay: 0,
        iterations: 1,
        curve: enums.AnimationCurve.easeOut
      }).then(() => {
        label.animate({
          opacity: .80,
          backgroundColor: new Color(newColor1),
          duration: 300,
          delay: 0,
          iterations: 1,
          curve: enums.AnimationCurve.easeOut
        }).then(() => {
          label.animate({
            opacity: 1,
            backgroundColor: new Color(backgrundCol),
          });
        });
      });

    }).catch((e) => {
      // console.log(e.message);
      label.animate({
        opacity: 1,
        backgroundColor: new Color(backgrundCol),
      });
    });


  }

  constructor(public store: Store<AppState>,
    questionActions: QuestionActions,
    gameActions: GameActions,
    userActions: UserActions, windowRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object,
    ngZone: NgZone,
    utils: Utils,
    cd: ChangeDetectorRef,
    private routerExtension: RouterExtensions,
    private page: Page
  ) {

    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId,
      ngZone,
      utils,
      cd);
    this.gameStatus = GameStatus;

  }


  tapped() {
    const tfElement = <Label>this.newLable.nativeElement;
    this.animate(tfElement);
  }

  taped() {
    const tfElement = <StackLayout>this.newstack.nativeElement;
    console.log('background color', tfElement.backgroundColor);
    const backgrundCol = String(tfElement.backgroundColor);
    console.log(typeof (backgrundCol));
    // this.animate(tfElement);
    console.log('calledf');
    tfElement.animate({
      opacity: 0.40,
      backgroundColor: new Color(backgrundCol),
      duration: 800,
      delay: 2,
      iterations: 1,
      curve: enums.AnimationCurve.easeOut
    }).then(() => {
      tfElement.animate({
        opacity: 1,
        backgroundColor: new Color(backgrundCol),
      });
    }).catch((e) => {
      console.log(e.message);
    });

  }

  ngOnInit() {

    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => { this.userDict = userDict; this.cd.markForCheck(); }));
    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
    }
    ));
  }

  startNewGame() {
    if (this.applicationSettings && this.applicationSettings.lives.enable) {
      if (this.account.lives > 0) {
        this.routerExtension.navigate(['/game-play'], { clearHistory: true });
      }
    } else {
      this.routerExtension.navigate(['/game-play'], { clearHistory: true });
    }

  }

  filterGame(game: Game): boolean {
    return game.GameStatus === GameStatus.AVAILABLE_FOR_OPPONENT ||
      game.GameStatus === GameStatus.JOINED_GAME ||
      game.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE
      || game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE;
  }


  filterSinglePlayerGame(game: Game): boolean {
    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Single) && game.playerIds.length === 1;
  }

  filterTwoPlayerGame = (game: Game): boolean => {
    return Number(game.gameOptions.playerMode) === Number(PlayerMode.Opponent) &&
      (game.nextTurnPlayerId === this.user.userId);
  }

  filterTwoPlayerWaitNextQGame = (game: Game): boolean => {
    return game.GameStatus === GameStatus.WAITING_FOR_NEXT_Q && game.nextTurnPlayerId !== this.user.userId;
  }

  ngOnDestroy(): void {
    this.page.off('loaded');
  }
}


