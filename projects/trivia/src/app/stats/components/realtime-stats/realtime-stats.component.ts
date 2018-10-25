import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { leaderBoardState } from '../../store';
import * as StatActions from '../../store/actions';
import { SystemStats } from 'shared-library/shared/model';
import { AppState } from '../../../store';
import { Utils } from 'shared-library/core/services';

@Component({
  selector: 'realtime-stats',
  templateUrl: './realtime-stats.component.html',
  styleUrls: ['./realtime-stats.component.scss']
})
export class RealtimeStatsComponent implements OnDestroy {

  systemStats: SystemStats;
  subs: Subscription[] = [];

  constructor(private store: Store<AppState>, private utils: Utils) {

    this.store.dispatch(new StatActions.LoadSystemStat());

    this.subs.push(this.store.select(leaderBoardState).pipe(select(s => s.systemStat)).subscribe(systemStats => {
      if (systemStats !== null) {
        this.systemStats = systemStats;
      }
    }));
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }
}
