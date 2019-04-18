import { Component,, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { Achievements } from './achievements';
@Component({
  selector: 'achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})

export class AchievementsComponent extends Achievements implements OnInit, OnDestroy {

  constructor(
    protected store: Store<AppState>,
    protected cd: ChangeDetectorRef
  ) {
    super(store, cd);
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
