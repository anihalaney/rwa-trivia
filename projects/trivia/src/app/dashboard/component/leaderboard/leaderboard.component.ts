import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { AppState } from '../../../store';
import { UserActions } from 'shared-library/core/store/actions';
import { Leaderboard } from './leaderboard';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class LeaderboardComponent extends Leaderboard {

  constructor(protected store: Store<AppState>,
    protected  userActions: UserActions,
    protected  utils: Utils,
    protected  route: ActivatedRoute,
    protected  cd: ChangeDetectorRef,
    protected ngZone: NgZone) {
    super(store, userActions, utils, route, cd, ngZone);
  }
}
