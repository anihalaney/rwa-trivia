import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import { FirebaseScreenNameConstants } from 'shared-library/shared/model';
import { Page } from 'tns-core-modules/ui/page';
import { AppState } from '../../../store';
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
