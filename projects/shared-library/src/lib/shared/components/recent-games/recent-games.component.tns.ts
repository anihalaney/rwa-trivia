import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from 'shared-library/core/store/actions';
import { Page } from 'tns-core-modules/ui/page';
import { CoreState } from 'shared-library/core/store';
import { RecentGames } from './recent-games';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@Component({
  selector: 'recent-games',
  templateUrl: './recent-games.component.html',
  styleUrls: ['./recent-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ arrayName: "subscriptions" })
export class RecentGamesComponent extends RecentGames implements OnInit, OnDestroy {

  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;

  constructor(store: Store<CoreState>,
    cd: ChangeDetectorRef,
    userActions: UserActions,
    private ngZone: NgZone,
    private page: Page
  ) {
    super(store, cd, userActions);
  }

  ngOnInit(): void {
    if (this.hideActionbar === undefined) {
      this.hideActionbar = false;
      this.cd.markForCheck();
    } else {
      this.hideActionbar = true;
      this.cd.markForCheck();
    }
    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
    }));
  }

  ngOnDestroy(): void {
    this.page.off('loaded');
    this.renderView = false;
  }
}
