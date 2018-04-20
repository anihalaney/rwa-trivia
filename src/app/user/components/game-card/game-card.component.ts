import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../store';
import { User, Game, Category } from '../../../model';
import { userState } from '../../store';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit, OnChanges {
  @Input() game: Game;
  @Input() userDict: { [key: string]: User };
  user$: Observable<User>;
  correctAnswerCount: number;
  questionIndex: number;
  user: User;
  myTurn: boolean;
  otherUserId: string;
  otherUserInfo: User;
  remainingHours: number;
  remainingMinutes: number;
  timerSub: Subscription;
  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };

  constructor(private store: Store<AppState>) {

    this.user$ = this.store.select(appState.coreState).select(s => s.user);
    this.user$.subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    });

    this.categoryDictObs = store.select(categoryDictionary);
    this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict);

    this.timerSub =
      Observable.timer(1000, 1000).subscribe(t => {
        if (this.game.nextTurnPlayerId === this.user.userId) {

          const currentTime = new Date((new Date().toUTCString())).getTime();
          const diff = currentTime - this.game.turnAt;
          const hour = Math.floor(diff / (60 * 60 * 1000));
          const minute = Math.floor(diff % (60 * 60 * 1000) / (60 * 1000));

          if (minute > 0) {
            this.remainingHours = 31 - hour;
            this.remainingMinutes = 60 - minute;

          } else {
            this.remainingHours = 32 - hour;
            this.remainingMinutes = 0;
          }


        }
      })
  }

  ngOnInit() {
    this.store.select(appState.coreState).take(1).subscribe(s => {
      this.user = s.user
      this.myTurn = this.game.nextTurnPlayerId === this.user.userId;



    }); // logged in user
  }

  ngOnChanges() {
    this.questionIndex = this.game.playerQnAs.length;
    this.correctAnswerCount = this.game.playerQnAs.filter((p) => p.answerCorrect).length;
    if (this.game) {
      this.otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
      this.otherUserInfo = this.userDict[this.otherUserId];


    }
  }


}
