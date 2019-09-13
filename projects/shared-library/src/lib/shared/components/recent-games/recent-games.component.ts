import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { User, GameStatus, Game } from 'shared-library/shared/model';
import { coreState, CoreState } from 'shared-library/core/store';
import { Observable } from 'rxjs';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { RecentGames } from './recent-games';
@Component({
  selector: 'recent-games',
  templateUrl: './recent-games.component.html',
  styleUrls: ['./recent-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecentGamesComponent extends RecentGames {

  constructor(store: Store<CoreState>,
    utils: Utils,
    cd: ChangeDetectorRef,
    userActions: UserActions) {
    super(store, cd, userActions);
  }

}
