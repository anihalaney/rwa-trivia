import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { AppState, appState, categoryDictionary } from '../../store';
import { Utils } from '../../core/services';
import { QuestionActions, GameActions } from '../../core/store/actions';
import { User, Category, Question, SearchResults, Game } from '../../model';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User;
  sub: Subscription;

  questionOfTheDay$: Observable<Question>;
  activeGames$: Observable<Game[]>;
  gameInvites: number[];  //change this to game invites
  gameSliceStartIndex: number;
  gameSliceLastIndex: number;
  now: Date;
  greeting: string;
  message: string;
  activeGames: Game[];

  constructor(private store: Store<AppState>,
    private questionActions: QuestionActions,
    private gameActions: GameActions) {
    this.questionOfTheDay$ = store.select(appState.coreState).select(s => s.questionOfTheDay);
    this.activeGames$ = store.select(appState.coreState).select(s => s.activeGames);
    this.gameInvites = [1, 2, 3];

    this.sub = store.select(appState.coreState).select(s => s.user).subscribe(user => {
      this.user = user
      if (user) {
        //Load active Games
        this.store.dispatch(this.gameActions.getActiveGames(user));
      }
    });
    this.activeGames$.subscribe(games => this.activeGames = games);
    this.gameSliceStartIndex = 0;
    this.gameSliceLastIndex = 8;
  }

  ngOnInit() {
    this.now = new Date();
    const hourOfDay = this.now.getHours();
    if (hourOfDay < 12) {
      this.greeting = 'Morning';
      this.message = 'Nice to see you again,are you ready for a new challenge!';
    } else if (hourOfDay < 17) {
      this.greeting = 'Afternoon';
      this.message = 'Caught you napping? Jog your mind with a new challenge!';
    } else {
      this.greeting = 'Evening';
      this.message = 'Relax your mind. Spice it up with a new game!';
    }
  }

  ngOnDestroy() {
    Utils.unsubscribe([this.sub]);
  }

  displayMoreGames(): void {
    this.gameSliceLastIndex = (this.activeGames.length > (this.gameSliceLastIndex + 8)) ?
      this.gameSliceLastIndex + 8 : this.activeGames.length;
  }
}
