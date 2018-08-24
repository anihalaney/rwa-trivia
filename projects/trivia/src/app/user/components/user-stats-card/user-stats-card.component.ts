import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { User } from '../../../../../../shared-library/src/public_api';
import { AppState, appState } from '../../../../../../shared-library/src/lib/store';

@Component({
  selector: 'user-stats-card',
  templateUrl: './user-stats-card.component.html',
  styleUrls: ['./user-stats-card.component.scss']
})
export class UserStatsCardComponent {
  user: User;

  constructor(private store: Store<AppState>) {
    store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user
      if (user) {
        this.user = user;
      }
    })
  }
}
