import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as userActions from '../../../user/store/actions';
import { User, GameStatus, Game } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { userState } from '../../store';
import { Subscription, Observable } from 'rxjs';
import { Utils } from 'shared-library/core/services';

@Component({
  selector: 'recent-games',
  templateUrl: './recent-games.component.html',
  styleUrls: ['./recent-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentGamesComponent implements OnInit, OnDestroy {

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
              private cd: ChangeDetectorRef) {

    this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
      this.store.dispatch(new userActions.GetGameResult(user));
    }));

    this.recentGames$ = this.store.select(userState).pipe(select(s => s.getGameResult));
  }

  ngOnInit(): void {
      this.subs.push(this.recentGames$.subscribe((recentGames) => {
      this.recentGames = recentGames;
      this.cd.detectChanges();
    }));
  }

  getMoreCard() {
    this.nextIndex = (this.recentGames.length > (this.maxIndex)) ?
      this.maxIndex : this.recentGames.length;
  }

  ngOnDestroy() {

    this.utils.unsubscribe(this.subs);
  }

}
