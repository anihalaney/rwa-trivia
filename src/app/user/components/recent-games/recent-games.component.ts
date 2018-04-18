import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../store';
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
  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };

  constructor(private store: Store<AppState>, ) {

    this.categoryDictObs = store.select(categoryDictionary);
    this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict);

    this.store.select(appState.coreState).select(s => s.user).subscribe(user => {

      this.user = user;
      if (user) {
        this.user = user;
      }
    });
    this.store.dispatch(new userActions.GetGameResult({ userId: this.user.userId }));

    this.store.select(userState).select(s => s.getGameResult).subscribe(result => {
      this.finalResult = result;
      console.log(JSON.stringify(this.finalResult));
    });


  }
}
