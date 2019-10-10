import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef, NgZone } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ModalDialogService } from 'nativescript-angular/directives/dialogs';
import { RouterExtensions } from 'nativescript-angular/router';
import { getImage } from 'nativescript-screenshot';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import { AppState, appState } from '../../../store';

import { Image } from "tns-core-modules/ui/image";
import {
  FirebaseAnalyticsEventConstants, FirebaseAnalyticsKeyConstants, GeneralConstants, PlayerMode, OpponentType, User, userCardType
} from '../../../../../../shared-library/src/lib/shared/model';
import { Page } from 'tns-core-modules/ui/page/page';
import { map, flatMap, filter } from 'rxjs/operators';


import {  Inject, PLATFORM_ID } from '@angular/core';
import { Utils, WindowRef } from 'shared-library/core/services';
import { GameActions, QuestionActions, UserActions } from 'shared-library/core/store/actions';
import { FirebaseScreenNameConstants, Game, GameStatus } from 'shared-library/shared/model';
import { Dashboard } from './dashboard';
@Component({
  selector: 'game-over',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class DashboardComponent extends Dashboard implements OnInit, OnDestroy {

  actionBarStatus: String = 'Game Result';
  isDispayMenu = false;
  stackLayout;
  otherUserId;
  game;
  otherUserInfo;
  userDict;
  showQuesAndAnswer: Boolean = true;
  PlayerMode = PlayerMode;
  OpponentType = OpponentType;
  loaderStatus = false;
  userDict$: any;
  subscriptions = [];
  user: User;


   correctCount: 1;
   noOfQuestions: 5;
  categoryName: string;
  totalRound: 2;

  questionsArray = [];
  socialFeedData;
  imageUrl = '';
  disableRematchBtn = false;
  playerUserName = 'You';
  opponentType = OpponentType;
  disableFriendInviteBtn = false;
  defaultAvatar = 'assets/images/default-avatar-game-over.png';
  account: Account;
  liveErrorMsg = 'Sorry, don\'t have enough life.';
  userInvitations: {};
  userCardType = userCardType;
  correctAnswerClassIndexIncrement = 0;
  gameStatus: any
  constructor(questionActions: QuestionActions,
    gameActions: GameActions,
    userActions: UserActions, windowRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object,
    utils: Utils,
    private routerExtension: RouterExtensions,
    public store: Store<AppState>, private page: Page, public ngZone: NgZone, cd: ChangeDetectorRef) {
    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId,
      ngZone,
      utils,
      cd);
    this.gameStatus = GameStatus;
    this.page.actionBarHidden = true;
    this.page.actionBarHidden = false;
      this.game = JSON.parse('{"gameOptions":{"categoryIds":[1,8,4],"gameMode":0,"isChallenge":false,"maxQuestions":8,"opponentType":null,"playerMode":"0","tags":["Open Source","Neo4J","Python"]},"playerIds":["Mq6MYVzQ9AUE0DZYE9acznA17KI2"],"nextTurnPlayerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","gameOver":true,"playerQnAs":[{"playerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","questionId":"U32AUiSBEfsLElmbLfyn","addedOn":1570540166000,"playerAnswerId":"2","playerAnswerInSeconds":4,"answerCorrect":true,"round":1,"isReported":false},{"playerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","questionId":"7mQCaB5rCMBSOg6qkopo","addedOn":1570540182000,"playerAnswerId":"3","playerAnswerInSeconds":0,"answerCorrect":true,"round":2,"isReported":false},{"playerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","questionId":"WXsGOEXfngzCqkBpI6Od","addedOn":1570540214000,"playerAnswerId":"0","playerAnswerInSeconds":2,"answerCorrect":false,"round":3,"isReported":false},{"playerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","questionId":"HZglr4Z0tD9c4IDOWmpF","addedOn":1570540222000,"playerAnswerId":"2","playerAnswerInSeconds":0,"answerCorrect":true,"round":4,"isReported":false},{"playerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","questionId":"Qc0wXfHttTdDbVtQpZ4a","addedOn":1570540228000,"playerAnswerId":"2","playerAnswerInSeconds":0,"answerCorrect":true,"round":5,"isReported":false},{"playerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","questionId":"4qihGtRNWSM4uG2TEns5","addedOn":1570540234000,"playerAnswerId":"2","playerAnswerInSeconds":1,"answerCorrect":true,"round":6,"isReported":false}],"gameId":"mUJ9fRGbalNuvz8XX1Ex","winnerPlayerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","GameStatus":"completed","createdAt":1570540165000,"turnAt":1570540237000,"gameOverAt":1570540238000,"stats":{"Mq6MYVzQ9AUE0DZYE9acznA17KI2":{"avgAnsTime":1,"consecutiveCorrectAnswers":0,"score":5}},"round":6}');
  }
  ngOnInit() {
    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => { this.userDict = userDict; this.cd.markForCheck(); }));
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
  }

  openDialog(question) {
    
  }

  stackLoaded(args) {
    this.stackLayout = args.object;
  }

  reMatchGame() {
   
  }

  screenshot() {
  
  }

  gotoDashboard() {
   
  }
}
