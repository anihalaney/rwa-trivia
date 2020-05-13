import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { dashboardState } from '../../store';
import * as StatActions from '../../store/actions';
import { SystemStats } from 'shared-library/shared/model';
import { AppState } from '../../../store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';


@Component({
  selector: 'realtime-stats',
  templateUrl: './realtime-stats.component.html',
  styleUrls: ['./realtime-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class RealtimeStatsComponent implements OnDestroy {

  systemStats: SystemStats;
  subscriptions = [];

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef) {

    this.store.dispatch(new StatActions.LoadSystemStat());

    this.subscriptions.push(this.store.select(dashboardState).pipe(select(s => s.systemStat)).subscribe(systemStats => {
      if (systemStats !== null) {
        this.systemStats = systemStats;
        this.cd.markForCheck();
      }
    }));
  }

  ngOnDestroy() {

  }
}
