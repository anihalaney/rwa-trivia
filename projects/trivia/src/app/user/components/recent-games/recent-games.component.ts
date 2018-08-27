import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as userActions from '../../../user/store/actions';
import { User } from '../../../../../../shared-library/src/lib/shared/model';
import { AppState, appState } from '../../../store';
import { userState } from '../../store';

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
  maxIndex = 10;

  constructor(private store: Store<AppState>, ) {

    this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
      if (user) {
        this.user = user;
      }
    });
    this.store.dispatch(new userActions.GetGameResult({ userId: this.user.userId }));

    this.store.select(userState).pipe(select(s => s.getGameResult)).subscribe(result => {
      this.finalResult = result;
    });

  }

  getMoreCard() {
    this.nextIndex = (this.finalResult.length > (this.maxIndex)) ?
      this.maxIndex : this.finalResult.length;

  }

}
