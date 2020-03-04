import { ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { AppState } from '../../store';
import { Achievements } from './achievements';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
@Component({
  selector: 'achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class AchievementsComponent extends Achievements {

  constructor(
    protected store: Store<AppState>,
    protected cd: ChangeDetectorRef,
    public utils: Utils
  ) {
    super(store, cd);
  }


}
