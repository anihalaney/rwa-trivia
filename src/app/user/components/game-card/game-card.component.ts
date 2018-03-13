import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AngularFireStorage } from 'angularfire2/storage';
import { AppState, appState } from '../../../store';
import { User, Game } from '../../../model';
import { userState } from '../../../user/store';
import * as userActions from '../../store/actions';

@Component({
  selector: 'game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit, OnChanges {
  @Input() game: Game;
  correctAnswerCount: number;
  questionIndex: number;
  profileImage: { image: any } = { image: '/assets/images/avatar.png' };
  basePath = '/profile';
  profileImagePath = 'avatar';
  userObs: Observable<User>;

  user: User;
  myTurn: boolean;

  constructor(private storage: AngularFireStorage, private store: Store<AppState>) {

    this.userObs = this.store.select(userState).select(s => s.user);
    this.userObs.subscribe(user => {
      if (user) {
        if (user.name) {
          this.user = user;
        } else {
          this.user.roles = user.roles;
        }

        if (this.user.profilePicture && this.user.name === user.name) {
          const filePath = `${this.basePath}/${this.user.userId}/${this.profileImagePath}/${this.user.profilePicture}`;
          const ref = this.storage.ref(filePath);
          ref.getDownloadURL().subscribe(res => {
            this.profileImage.image = res;
          });
        }
      }
    });

  }

  ngOnInit() {
    this.store.select(appState.coreState).take(1).subscribe(s => {
      this.user = s.user
      this.myTurn = this.game.nextTurnPlayerId === this.user.userId;
    });
    // this.store.dispatch(new userActions.LoadUserProfile({ user: this.user }));
    //logged in user

  }

  ngOnChanges() {
    this.questionIndex = this.game.playerQnAs.length;
    this.correctAnswerCount = this.game.playerQnAs.filter((p) => p.answerCorrect).length;
  }

}
