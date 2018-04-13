import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { AppState, appState, categoryDictionary } from '../../store';
import { Utils } from '../../core/services';
import { QuestionActions, GameActions, UserActions } from '../../core/store/actions';
import { User, Category, Question, SearchResults, Game } from '../../model';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User;
  subs: Subscription[] = [];
  users: User[];
  questionOfTheDay$: Observable<Question>;
  activeGames$: Observable<Game[]>;
  userDict$: Observable<{ [key: string]: User }>;
  gameInvites: number[];  // change this to game invites
  gameSliceStartIndex: number;
  gameSliceLastIndex: number;
  now: Date;
  greeting: string;
  message: string;
  activeGames: Game[];
  showGames: boolean;
  showNewsCard = true;
  userDict: { [key: string]: User } = {};

  constructor(private store: Store<AppState>,
    private questionActions: QuestionActions,
    private gameActions: GameActions,
    private userActions: UserActions) {
    this.questionOfTheDay$ = store.select(appState.coreState).select(s => s.questionOfTheDay);
    this.activeGames$ = store.select(appState.coreState).select(s => s.activeGames);
    this.userDict$ = store.select(appState.coreState).select(s => s.userDict);
    this.gameInvites = [1, 2, 3];
    this.subs.push(store.select(appState.coreState).select(s => s.user).subscribe(user => {
      this.user = user
      if (user) {
        this.user = user;
        if (this.user.isSubscribed) {
          this.showNewsCard = false;
        }
        // Load active Games
        this.store.dispatch(this.gameActions.getActiveGames(user));
      } else {
        this.showNewsCard = true;
      }
    }));

    this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));

    this.subs.push(this.activeGames$.subscribe(games => {
      if (games.length > 0) {
        this.activeGames = games;
        this.activeGames.map(game => {
            const playerIds = game.playerIds;
            playerIds.map(playerId => {
                if (playerId !== this.user.userId) {
                  this.store.dispatch(this.userActions.loadOtherUserProfile(playerId));
                }
              });
          });
          this.showGames = true;
        }
      }));

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

  displayMoreGames(): void {
    this.gameSliceLastIndex = (this.activeGames.length > (this.gameSliceLastIndex + 8)) ?
      this.gameSliceLastIndex + 8 : this.activeGames.length;
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
}
