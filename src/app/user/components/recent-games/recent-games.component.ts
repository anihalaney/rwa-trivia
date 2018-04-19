import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../store';
import * as userActions from '../../../user/store/actions';
import { User, Subscription, Game, Category } from '../../../model';
import { userState } from '../../store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'recent-games',
  templateUrl: './recent-games.component.html',
  styleUrls: ['./recent-games.component.scss']
})
export class RecentGamesComponent {

  user: User;
  finalResult = [];
  @Input() userDict: { [key: string]: User };
  startIndex = 0;
  nextIndex = 4;

  constructor(private store: Store<AppState>, ) {

    this.store.select(appState.coreState).select(s => s.user).subscribe(user => {
      this.user = user;
      if (user) {
        this.user = user;
      }
    });
    this.store.dispatch(new userActions.GetGameResult({ userId: this.user.userId }));

    this.store.select(userState).select(s => s.getGameResult).subscribe(result => {
      this.finalResult = result;
    });

  }

  getMoreCard() {
    this.nextIndex = (this.finalResult.length > (this.nextIndex + 6)) ?
      this.nextIndex + 6 : this.finalResult.length;

  }

}
