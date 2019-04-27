import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { AppState } from '../../../store';
import { UserActions } from './../../../../../../shared-library/src/lib/core/store/actions';
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
    protected  cd: ChangeDetectorRef) {
    super(store, userActions, utils, route, cd);
  }
}
