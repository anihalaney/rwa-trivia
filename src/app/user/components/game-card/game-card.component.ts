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
  @Input() users: User[];
  user$: Observable<User>;
  userDict: { [key: string]: User };
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
    this.userDict = {};
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

  getUserObj(otherUserId: string): User {
    return (this.userDict[otherUserId]) ? this.userDict[otherUserId] : this.users.filter(user => user.userId = otherUserId)[0];
  }

  getOtherUserName(game: Game): string {
    const defaultName = 'Kaanishhk';
    if (this.users && game.playerIds.length > 1) {
      {
        const otherUserId = this.game.playerIds[1];
        const userObj = this.getUserObj(otherUserId);
        if (userObj.displayName) {
          this.userDict[otherUserId] = userObj;
          return userObj.displayName;
        } else {
          return defaultName;
        }
      }
    } else {
      return defaultName;
    }
  }

  getOtherUserLocation(game: Game): string {
    const defaultLocation = 'hristol';
    if (this.users && game.playerIds.length > 1) {
      {
        const otherUserId = this.game.playerIds[1];
        const userObj = this.getUserObj(otherUserId);
        if (userObj.location) {
          this.userDict[otherUserId] = userObj;
          return userObj.location;
        } else {
          return defaultLocation;
        }
      }
    } else {
      return defaultLocation;
    }
  }

  getOtherUserProfileUrl(game: Game): string {
    const image = '/assets/images/opponent.png';
    if (this.users && game.playerIds.length > 1) {
      {
        const otherUserId = this.game.playerIds[1];
        const userObj = this.getUserObj(otherUserId);
        if (userObj.profilePictureUrl) {
          this.userDict[otherUserId] = userObj;
          return userObj.profilePictureUrl;
        } else {
          return image;
        }
      }
    } else {
      return image;
    }
  }


}
