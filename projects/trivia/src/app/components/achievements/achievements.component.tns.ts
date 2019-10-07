import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
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

export class AchievementsComponent extends Achievements implements OnDestroy {

  constructor(
    protected store: Store<AppState>,
    protected cd: ChangeDetectorRef,
    public utils: Utils
  ) {
    super(store, cd);
  }



  ngOnDestroy() {
  }

}
