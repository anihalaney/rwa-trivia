import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { Achievements } from './achievements';
@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AchievementsComponent extends Achievements {

  constructor(
    protected store: Store<AppState>,
    protected cd: ChangeDetectorRef
  ) {
    super(store, cd);
  }

}
