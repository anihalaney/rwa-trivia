import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { leaderBoardState } from '../../store';
import * as StatActions from '../../store/actions';
import { SystemStats } from '../../../../../../shared-library/src/lib/shared/model';
import { AppState } from '../../../store';

@Component({
  selector: 'realtime-stats',
  templateUrl: './realtime-stats.component.html',
  styleUrls: ['./realtime-stats.component.scss']
})
export class RealtimeStatsComponent {

  systemStats: SystemStats;

  constructor(private store: Store<AppState>) {

    this.store.dispatch(new StatActions.LoadSystemStat());

    this.store.select(leaderBoardState).pipe(select(s => s.systemStat)).subscribe(systemStats => {
      if (systemStats !== null) {
        this.systemStats = systemStats;
      }
    });
  }
}
