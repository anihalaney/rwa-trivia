import { Component } from '@angular/core';
import * as statsActions from '../../../stats/store/actions';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { Category, User } from '../../../model';
import { statsState } from '../../store';
import { concat } from 'rxjs/operator/concat';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {

  categoryDictObs: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  categoriesObs: Observable<Category[]>;
  categories: Category[];
  scoreList = [];

  constructor(private store: Store<AppState>) {


    this.categoryDictObs = store.select(categoryDictionary);

    this.categoryDictObs.subscribe(categoryDict => {

      this.categoryDict = categoryDict;

      this.store.dispatch(new statsActions.GetLeaderBorad({ categoryList: this.categoryDict }));
    });

    this.store.select(statsState).select(s => s.scoreBorad).subscribe(score => {
      if (score !== null) {

        Object.keys(score).forEach((key) => {
          let userList = [];
          const countList = [];
          userList = Object.keys(score[key]);
          userList.forEach(function (val, index) {

            countList.push(score[key][Object.keys(score[key])[index]].length);
          });
          this.scoreList.push({ catId: key, users: userList, count: countList });
        });
      }

    });
  }
}
