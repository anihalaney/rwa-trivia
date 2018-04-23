import { Component, Input } from '@angular/core';
import * as statsActions from '../../../stats/store/actions';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { Category, User, LeaderBoardUser } from '../../../model';
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
  @Input() leaderBoardStatDict: { [key: string]: Array<LeaderBoardUser> };
  @Input() leaderBoardCat: Array<string>;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  lbsSliceStartIndex: number;
  lbsSliceLastIndex: number;

  constructor(private store: Store<AppState>,
    private userActions: UserActions) {
    this.categoryDict$ = store.select(categoryDictionary);
    this.categoryDict$.subscribe(categoryDict => {
      this.categoryDict = categoryDict;
    });
    this.lbsSliceStartIndex = 0;
    this.lbsSliceLastIndex = 3;
  }


  displayMore(): void {
    this.lbsSliceLastIndex = (this.leaderBoardCat.length > (this.lbsSliceLastIndex + 3)) ?
      this.lbsSliceLastIndex + 3 : this.leaderBoardCat.length;
  }

}
