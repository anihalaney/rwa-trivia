import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as userActions from '../../../user/store/actions';
import { User, GameStatus, Game } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { userState } from '../../store';
import { Subscription, Observable } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
@Component({
  selector: 'recent-games',
  templateUrl: './recent-games.component.html',
  styleUrls: ['./recent-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class RecentGamesComponent implements OnInit, OnDestroy {

  user: User;
  recentGames: Game[] = [];
  startIndex = 0;
  nextIndex = 4;
  maxIndex = 10;
  GameStatus = GameStatus;
  recentGames$: Observable<Game[]>;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  subscriptions = [];

  constructor(private store: Store<AppState>,
    private cd: ChangeDetectorRef) {

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
      this.store.dispatch(new userActions.GetGameResult(user));
    }));

    this.recentGames$ = this.store.select(userState).pipe(select(s => s.getGameResult));

    this.subscriptions.push(this.recentGames$.subscribe((recentGames) => {
      this.recentGames = recentGames;
      this.cd.markForCheck();
    }));
  }

  ngOnInit(): void {
  }

  getMoreCard() {
    this.nextIndex = (this.recentGames.length > (this.maxIndex)) ?
      this.maxIndex : this.recentGames.length;
      this.cd.markForCheck();
  }

  ngOnDestroy() {
  }

}
