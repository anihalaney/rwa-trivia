import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { Achievements } from './achievements';
@Component({
  selector: 'achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})

export class AchievementsComponent extends Achievements implements OnInit {

  renderView = false;

  constructor(
    public store: Store<AppState>
  ) {
    super(store);

  }

  ngOnInit() {
  }
}
