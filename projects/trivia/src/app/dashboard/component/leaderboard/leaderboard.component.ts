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

  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User };
  leaderBoardStatDict: { [key: string]: Array<LeaderBoardUser> };
  leaderBoardCat: Array<string>;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  lbsSliceStartIndex: number = -1;
  lbsSliceLastIndex: number;
  lbsUsersSliceStartIndex: number;
  lbsUsersSliceLastIndex: number;
  maxLeaderBoardDisplay: number;
  platformIds: any;
  isbrowser: any;
  isServer: any;
  defaultAvatar = 'assets/images/default-avatar-small.png';
  unknown = LeaderBoardConstants.UNKNOWN;
  category: string;
  subscriptions = [];

  constructor(store: Store<AppState>,
    userActions: UserActions,
    utils: Utils,
    route: ActivatedRoute,
    cd: ChangeDetectorRef) {
    super(store, userActions, utils, route, cd);
  }
}
