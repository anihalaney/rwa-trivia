import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../store';
import * as userActions from '../../../user/store/actions';
import { User, Subscription, Game } from '../../../model';
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

  constructor(private store: Store<AppState>, ) {
    this.store.select(appState.coreState).select(s => s.user).subscribe(user => {

      this.user = user;
      if (user) {
        this.user = user;
      }
    });
    this.store.dispatch(new userActions.GetGameResult({ userId: this.user.userId }));


    this.store.select(userState).select(s => s.getGameResult).subscribe(result => {
      let totalResult = [];
      if (result.length > 0) {
        result[0].subscribe((player0) => {
          totalResult = player0;
          result[1].subscribe((player1) => {
            Array.prototype.push.apply(totalResult, player1);
            totalResult.sort((a: any, b: any) => { return (b.turnAt - b.turnAt) });
            this.finalResult = totalResult;
            });
        });

      }
    });


  }
}
