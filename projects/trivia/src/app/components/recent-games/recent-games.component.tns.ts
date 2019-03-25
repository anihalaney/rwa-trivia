import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit, NgZone } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { User, GameStatus, Game } from 'shared-library/shared/model';
import { AppState, appState } from '../../store';
import { Observable } from 'rxjs';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { RecentGames } from './recent-games';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'recent-games',
  templateUrl: './recent-games.component.html',
  styleUrls: ['./recent-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecentGamesComponent extends RecentGames implements OnInit, OnDestroy {

  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;

  constructor(store: Store<AppState>,
    cd: ChangeDetectorRef,
    userActions: UserActions,
    private ngZone: NgZone,
    private page: Page) {
    super(store, cd, userActions);
  }

  ngOnInit(): void {
    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
    }));
  }

  ngOnDestroy(): void {
    this.page.off('loaded');
  }
}
