import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { User, GameStatus, Game } from 'shared-library/shared/model';
import { AppState, appState } from '../../store';
import { Subscription, Observable } from 'rxjs';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store/actions';

@Component({
  selector: 'recent-games',
  templateUrl: './recent-games.component.html',
  styleUrls: ['./recent-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentGamesComponent implements OnInit, OnDestroy, AfterViewInit {

  user: User;
  recentGames: Game[] = [];
  startIndex = 0;
  nextIndex = 4;
  maxIndex = 10;
  subs: Subscription[] = [];
  GameStatus = GameStatus;
  recentGames$: Observable<Game[]>;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};

  constructor(private store: Store<AppState>,
    private utils: Utils,
    private cd: ChangeDetectorRef,
    private userActions: UserActions) {
    this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
      this.store.dispatch(this.userActions.getGameResult(user));
    }));

    this.recentGames$ = this.store.select(appState.coreState).pipe(select(s => s.getGameResult));

    this.subs.push(this.recentGames$.subscribe((recentGames) => {
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
    this.utils.unsubscribe(this.subs);
  }

  ngAfterViewInit() {

  }
}
