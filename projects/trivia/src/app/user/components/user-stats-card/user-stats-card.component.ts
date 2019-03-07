import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Account } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { Observable, Subscription } from 'rxjs';
import { Utils } from 'shared-library/core/services';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
@Component({
  selector: 'user-stats-card',
  templateUrl: './user-stats-card.component.html',
  styleUrls: ['./user-stats-card.component.scss']
})

@AutoUnsubscribe()
export class UserStatsCardComponent implements OnDestroy {
  account: Account;

  constructor(private store: Store<AppState>, private utils: Utils) {
    store.select(appState.coreState).pipe(select(s => s.account)).subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  ngOnDestroy() {
  }
}
