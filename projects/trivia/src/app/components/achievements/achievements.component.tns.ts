import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { FirebaseScreenNameConstants } from 'shared-library/shared/model';
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
    protected cd: ChangeDetectorRef,
    public utils: Utils
  ) {
    super(store, cd);
  }

  ngOnInit() {}

  ngOnDestroy() {}

}
