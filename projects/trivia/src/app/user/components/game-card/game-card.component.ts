import { Component, Input, OnInit, OnChanges, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { User, Game, Category, PlayerMode, GameStatus } from '../../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';
import { take } from 'rxjs/operators';


@Component({
  selector: 'game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() game: Game;
  @Input() userDict: { [key: string]: User };
  user$: Observable<User>;
  correctAnswerCount: number;
  questionIndex: number;
  user: User;
  myTurn: boolean;
  otherUserId: string;
  otherUserInfo: User;
  remainingHours: any;
  remainingMinutes: any;
  subs: Subscription[] = [];
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  randomCategoryId = 0;
  PlayerMode = PlayerMode;
  totalRound = 16;
  gameStatus: any;
  defaultAvatar = 'assets/images/default-avatar-small.png';
  constructor(private store: Store<AppState>) {

    this.gameStatus = GameStatus;

    this.user$ = this.store.select(appState.coreState).pipe(select(s => s.user));
    this.subs.push(this.user$.subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    }));

    this.categoryDict$ = store.select(categoryDictionary);
    this.subs.push(this.categoryDict$.subscribe(categoryDict => this.categoryDict = categoryDict));

    this.subs.push(
      timer(1000, 1000).subscribe(t => {
        if (this.game.nextTurnPlayerId === this.user.userId) {

          const utcDate = new Date(new Date().toUTCString());
          const currentMillis = utcDate.getTime();

          const diff = currentMillis - this.game.turnAt;
          const hour = Math.floor(diff / (60 * 60 * 1000));
          const minute = Math.floor(diff % (60 * 60 * 1000) / (60 * 1000));

          if (minute > 0) {
            this.remainingHours = Utils.convertIntoDoubleDigit(31 - hour);
            this.remainingMinutes = Utils.convertIntoDoubleDigit(60 - minute);

          } else {
            this.remainingHours = Utils.convertIntoDoubleDigit(32 - hour);
            this.remainingMinutes = Utils.convertIntoDoubleDigit(0);
          }
        }
      }));

  }

  ngOnInit() {
    this.store.select(appState.coreState).pipe(take(1)).subscribe(s => {
      this.user = s.user
      this.myTurn = this.game.nextTurnPlayerId === this.user.userId;
      this.randomCategoryId = Math.floor(Math.random() * this.game.gameOptions.categoryIds.length);
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

  getImageUrl(user: User) {
    return Utils.getImageUrl(user, 70, 60, '70X60');
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}
