import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Category, User, LeaderBoardUser, LeaderBoardConstants } from './../../../../../../shared-library/src/lib/shared/model';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { AppState } from '../../../store';
import { UserActions } from './../../../../../../shared-library/src/lib/core/store/actions';
import { ActivatedRoute } from '@angular/router';
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
