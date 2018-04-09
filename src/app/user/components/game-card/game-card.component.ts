import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../store';
import { User, Game } from '../../../model';
import { userState } from '../../store';

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



  constructor(private store: Store<AppState>) {

    this.user$ = this.store.select(appState.coreState).select(s => s.user);

    this.user$.subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    });
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

  getRound(playerId: string) {
    return this.game.playerQnAs.filter((p) => p.playerId === playerId).length
  }

  getScore(playerId: string) {
    return this.game.playerQnAs.filter((p) => p.answerCorrect && p.playerId === playerId).length
  }

  // getUserObj(otherUserId: string): User {
  //   return (this.userDict[otherUserId]) ? this.userDict[otherUserId] : this.users.filter(user => user.userId = otherUserId)[0];
  // }

  getOtherUserName(game: Game): string {
    const otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0]
    const userInfo = this.userDict[otherUserId];
    return userInfo.displayName;
  }

  getOtherUserLocation(game: Game): string {
    const otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0]
    const userInfo = this.userDict[otherUserId];
    return userInfo.location;
  }

  getOtherUserProfileUrl(game: Game): string {
    const otherUserId = this.game.playerIds.filter(userId => userId !== this.user.userId)[0]
    const userInfo = this.userDict[otherUserId];
    return userInfo.profilePictureUrl;
  }


}
