import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { dashboardState } from '../../store';
import * as StatActions from '../../store/actions';
import { SystemStats } from 'shared-library/shared/model';
import { AppState } from '../../../store';
import { Utils } from 'shared-library/core/services';

@Component({
  selector: 'realtime-stats',
  templateUrl: './realtime-stats.component.html',
  styleUrls: ['./realtime-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealtimeStatsComponent implements OnDestroy {

  systemStats: SystemStats;
  subs: Subscription[] = [];

  constructor(private store: Store<AppState>, private utils: Utils, private cd: ChangeDetectorRef) {

    this.store.dispatch(new StatActions.LoadSystemStat());

    this.subs.push(this.store.select(dashboardState).pipe(select(s => s.systemStat)).subscribe(systemStats => {
      if (systemStats !== null) {
        this.systemStats = systemStats;
        this.cd.markForCheck();
      }
    }));
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }
}
