import { Component } from '@angular/core';
import * as statsActions from '../../../stats/store/actions';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../store';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {

  constructor(private store: Store<AppState>) {
    this.store.dispatch(new statsActions.GetLeaderBorad());
  }
}
