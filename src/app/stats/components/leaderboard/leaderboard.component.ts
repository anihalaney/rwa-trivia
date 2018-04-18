import { Component, Input } from '@angular/core';
import * as statsActions from '../../../stats/store/actions';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { Category, User } from '../../../model';
import { leaderBoardState } from '../../store';
import { concat } from 'rxjs/operator/concat';
import { UserActions } from '../../../core/store/actions';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {
  @Input() userDict: { [key: string]: User };
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  scoreList = [];


  constructor(private store: Store<AppState>,
    private userActions: UserActions) {


    this.categoryDict$ = store.select(categoryDictionary);

    this.categoryDict$.subscribe(categoryDict => {

      this.categoryDict = categoryDict;

      this.store.dispatch(new statsActions.GetLeaderBoard({ categoryList: this.categoryDict }));
    });

    this.store.select(leaderBoardState).select(s => s.scoreBoard).subscribe(score => {
      if (score !== null) {

        Object.keys(score).forEach((key) => {
          let userList = [];
          const countList = [];
          userList = Object.keys(score[key]);
          userList.forEach((val, index) => {
            if (!this.userDict[val]) {
              this.store.dispatch(this.userActions.loadOtherUserProfile(val));
            }
            countList.push(score[key][Object.keys(score[key])[index]].length);
          });
          this.scoreList.push({ catId: key, users: userList, count: countList });
        });

      }

    });
  }


}
