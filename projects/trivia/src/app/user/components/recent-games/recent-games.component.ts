import { Component, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as userActions from '../../../user/store/actions';
import { User, GameStatus, Game } from '../../../../../../shared-library/src/lib/shared/model';
import { AppState, appState } from '../../../store';
import { userState } from '../../store';
import { Subscription, Observable } from 'rxjs';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';

@Component({
  selector: 'recent-games',
  templateUrl: './recent-games.component.html',
  styleUrls: ['./recent-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentGamesComponent implements OnDestroy {

  user: User;
  recentGames: Game[] = [];
  @Input() userDict: { [key: string]: User };
  startIndex = 0;
  nextIndex = 4;
  maxIndex = 10;
  subs: Subscription[] = [];
  GameStatus = GameStatus;
  recentGames$: Observable<Game[]>;

  constructor(private store: Store<AppState>, private utils: Utils) {

    this.subs.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
      this.store.dispatch(new userActions.GetGameResult(user));
    }));


    this.recentGames$ = this.store.select(userState).pipe(select(s => s.getGameResult));
    this.recentGames$.subscribe((recentGames) => {
      this.recentGames = recentGames;
    });

  }

  getMoreCard() {

    this.nextIndex = (this.recentGames.length > (this.maxIndex)) ?
      this.maxIndex : this.recentGames.length;

  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

}
