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

   // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;

  constructor(protected store: Store<AppState>,
    protected userActions: UserActions,
    protected utils: Utils,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
    private page: Page,
    private ngZone: NgZone) {

    super(store, userActions, utils, route, cd);
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      cd.markForCheck();
    }));

  }

  ngOnDestroy() {
    this.page.off('loaded');
  }
}
