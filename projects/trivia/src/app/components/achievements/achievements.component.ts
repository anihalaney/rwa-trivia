import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { Achievements } from './achievements';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe({ arrayName: 'subscriptions' })
export class AchievementsComponent extends Achievements {
  constructor(
    protected store: Store<AppState>,
    protected cd: ChangeDetectorRef
  ) {
    super(store, cd);
  }
}
