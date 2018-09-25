import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { User } from '../../../../../../shared-library/src/lib/shared/model';
import { AppState, appState } from '../../../store';
import { Observable, Subscription } from 'rxjs';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';

@Component({
  selector: 'user-stats-card',
  templateUrl: './user-stats-card.component.html',
  styleUrls: ['./user-stats-card.component.scss']
})
export class UserStatsCardComponent implements OnDestroy {
  user: User;
  subs: Subscription[] = [];

  constructor(private store: Store<AppState>) {
    this.subs.push(store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user
      if (user) {
        this.user = user;
      }
    }));
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}
