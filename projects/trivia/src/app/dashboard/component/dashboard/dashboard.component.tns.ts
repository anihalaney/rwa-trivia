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
      this.game = JSON.parse('{"gameOptions":{"categoryIds":[1,8,5],"friendId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","gameMode":0,"isChallenge":false,"maxQuestions":8,"opponentType":1,"playerMode":1,"rematch":true,"tags":["JavaScript"]},"playerIds":["oEqf1jJp8AeDOBRf8RW3nkdU02Y2","Mq6MYVzQ9AUE0DZYE9acznA17KI2"],"nextTurnPlayerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","gameOver":true,"playerQnAs":[{"playerId":"oEqf1jJp8AeDOBRf8RW3nkdU02Y2","questionId":"gsDwa5pbhkTeCBmszzC0","addedOn":1570533182000,"playerAnswerId":"3","playerAnswerInSeconds":5,"answerCorrect":false,"round":1,"isReported":false},{"playerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","questionId":"0JFJ1nzdTpIZ6JxDN26N","addedOn":1570533229000,"playerAnswerId":"1","playerAnswerInSeconds":7,"answerCorrect":false,"round":1,"isReported":false},{"playerId":"oEqf1jJp8AeDOBRf8RW3nkdU02Y2","questionId":"NkZ60EgiuYBsqt22B3pn","addedOn":1570533257000,"playerAnswerId":"2","playerAnswerInSeconds":5,"answerCorrect":true,"round":2,"isReported":false},{"playerId":"oEqf1jJp8AeDOBRf8RW3nkdU02Y2","questionId":"8GfvXXkdRuQhkUeUWK2W","addedOn":1570533273000,"playerAnswerId":"0","playerAnswerInSeconds":2,"answerCorrect":false,"round":2,"isReported":false},{"playerId":"Mq6MYVzQ9AUE0DZYE9acznA17KI2","questionId":"HMtgftCoqIhzMEIiioPM","addedOn":1570533285000,"playerAnswerId":"2","playerAnswerInSeconds":3,"answerCorrect":true,"round":2,"isReported":false}],"gameId":"8vb2I6jqIxank9SsZ8vo","winnerPlayerId":"oEqf1jJp8AeDOBRf8RW3nkdU02Y2","GameStatus":"time expired","createdAt":1570533178000,"turnAt":1570533295000,"gameOverAt":1570650064000,"stats":{"Mq6MYVzQ9AUE0DZYE9acznA17KI2":{"avgAnsTime":5,"consecutiveCorrectAnswers":1,"score":1},"oEqf1jJp8AeDOBRf8RW3nkdU02Y2":{"avgAnsTime":4,"consecutiveCorrectAnswers":0,"score":1}},"round":2}');
  }
  ngOnInit() {
    this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => { this.userDict = userDict; this.cd.markForCheck(); }));
    if (this.game) {
      this.otherUserId = 'oeqf1jjp8aedobrf8rw3nkdu02y2';
      this.otherUserInfo = JSON.parse('{"totalfriends":0,"displayname":"pycharmer1011","location":"ahmedabad,india","profilepicture":"1559197500861-3209261-32.png","userid":"oeqf1jjp8aedobrf8rw3nkdu02y2","email":"priyankamavani99@gmail.com","isFriend":true,"online":false}');
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
