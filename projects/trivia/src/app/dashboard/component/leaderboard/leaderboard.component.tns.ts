import { Component, OnDestroy, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, NgZone} from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';
import { Category, User, LeaderBoardUser, LeaderBoardConstants } from './../../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { AppState } from '../../../store';
import { UserActions } from './../../../../../../shared-library/src/lib/core/store/actions';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'tns-core-modules/ui/page';
import { Leaderboard } from './leaderboard';
@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LeaderboardComponent extends Leaderboard implements OnDestroy {

  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User };
  leaderBoardStatDict: { [key: string]: Array<LeaderBoardUser> };
  leaderBoardCat: Array<string>;
  categoryDict$: Observable<{ [key: number]: Category }>;
  categoryDict: { [key: number]: Category };
  lbsSliceStartIndex: number;
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
  page: Page;
   // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;

  constructor(store: Store<AppState>,
    userActions: UserActions,
    utils: Utils,
    route: ActivatedRoute,
    cd: ChangeDetectorRef,
    page: Page,
    ngZone: NgZone) {

    super(store, userActions, utils, route, cd);
    this.page = page;
    this.page.on('loaded', () => ngZone.run(() => {
      this.renderView = true;
      cd.markForCheck();
    }));

  }

  ngOnDestroy() {
    this.page.off('loaded');
  }
}
