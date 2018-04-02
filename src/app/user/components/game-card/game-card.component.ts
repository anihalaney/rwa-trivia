import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState, appState, UserDictionary } from '../../../store';
import { User, Game } from '../../../model';

@Component({
  selector: 'game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit, OnChanges {
  @Input() game: Game;
  correctAnswerCount: number;
  questionIndex: number;
  userDict: { [key: string]: User };
  user: User;
  myTurn: boolean;

  constructor(private store: Store<AppState>) {
    store.select(UserDictionary).subscribe(userDict => this.userDict = userDict);
  }

  ngOnInit() {
    this.store.select(appState.coreState).take(1).subscribe(s => {
      this.user = s.user
      this.myTurn = this.game.nextTurnPlayerId === this.user.userId;
    }); //logged in user
  }

  ngOnChanges() {
    this.questionIndex = this.game.playerQnAs.length;
    this.correctAnswerCount = this.game.playerQnAs.filter((p) => p.answerCorrect).length;
  }

  getUserProfileUrl(userId: string): string {
    if (this.userDict) {
      return this.userDict[userId].profilePictureUrl;
    } else {
      return '/assets/images/opponent.png';
    }
  }

}
