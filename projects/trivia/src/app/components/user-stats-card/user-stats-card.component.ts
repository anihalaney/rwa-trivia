import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Account } from 'shared-library/shared/model';
import { AppState, appState } from '../../store';
import { Utils } from 'shared-library/core/services';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
@Component({
  selector: 'user-stats-card',
  templateUrl: './user-stats-card.component.html',
  styleUrls: ['./user-stats-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class UserStatsCardComponent implements OnDestroy {

  account: Account;
  subscriptions = [];

  constructor(private store: Store<AppState>, private utils: Utils, private cd: ChangeDetectorRef) {
    this.subscriptions.push(store.select(appState.coreState).pipe(select(s => s.account)).subscribe(account => {
      if (account) {
        this.account = account;
        this.cd.detectChanges();
      }
    }));
  }

  ngOnDestroy() {
  }
}
