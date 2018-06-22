import { Component } from '@angular/core';
import { AppState, appState } from '../../../store';
import { Store } from '@ngrx/store';
import { User } from '../../../model';

@Component({
  selector: 'user-stats-card',
  templateUrl: './user-stats-card.component.html',
  styleUrls: ['./user-stats-card.component.scss']
})
export class UserStatsCardComponent {
  user: User;

  constructor(private store: Store<AppState>) {
    store.select(appState.coreState).select(s => s.user).subscribe(user => {
      this.user = user
      if (user) {
        this.user = user;
      }
    })
  }
}
