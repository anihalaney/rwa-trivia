import { Component, Input, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { Observable, Subscription, pipe } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';


import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { QuestionActions, GameActions, UserActions } from '../../../../../shared-library/src/lib/core/store/actions';
import * as gameplayactions from '../../game-play/store/actions';
import {
  User, Category, Question, SearchResults, Game, LeaderBoardUser, OpponentType
} from '../../../../../shared-library/src/lib/shared/model';
import { Utils, WindowRef } from '../../../../../shared-library/src/lib/core/services';
import { AppState, appState, categoryDictionary } from '../../store';


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
  gameSliceStartIndex: number;
  gameSliceLastIndex: number;
  gameInviteSliceStartIndex: number;
  gameInviteSliceLastIndex: number;
  now: Date;
  greeting: string;
  message: string;
  activeGames: Game[];
  showGames: boolean;
  showNewsCard = true;
  userDict: { [key: string]: User } = {};
  missingCardCount = 0;
  numbers = [];
  gameInvites: Game[];
  friendCount = 0;
  randomPlayerCount = 0;
  maxGameCardPerRow: number;
  screenWidth: number;

  constructor(private store: Store<AppState>,
    private questionActions: QuestionActions,
    private gameActions: GameActions,
    private userActions: UserActions, private windowRef: WindowRef,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.questionOfTheDay$ = store.select(appState.coreState).pipe(select(s => s.questionOfTheDay));
    this.activeGames$ = store.select(appState.coreState).pipe(select(s => s.activeGames));
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));


    this.subs.push(store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user
      if (user) {
        this.user = user;
        if (this.user.isSubscribed) {
          this.showNewsCard = false;
        }
        // Load active Games
        this.store.dispatch(this.gameActions.getActiveGames(user));
        this.store.dispatch(new gameplayactions.LoadGameInvites(user.userId));

      } else {
        this.showNewsCard = true;
      }
    }));

    this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));

    this.subs.push(this.activeGames$.subscribe(games => {
      this.activeGames = games;
      if (games.length > 0) {
        this.screenWidth = this.windowRef.nativeWindow.innerWidth;
        this.checkCardCountPerRow();
        this.activeGames.map(game => {
          const playerIds = game.playerIds;
          playerIds.map(playerId => {
            if (playerId !== this.user.userId) {
              if (this.userDict[playerId] === undefined) {
                this.store.dispatch(this.userActions.loadOtherUserProfile(playerId));
              }

            }
          });
        });
        this.showGames = true;
      }
    }));


    this.gameSliceStartIndex = 0;
    this.gameSliceLastIndex = 8;

    this.subs.push(this.store.select(appState.gameplayState).pipe(select(s => s.gameInvites)).subscribe(iGames => {
      this.gameInvites = iGames;
      this.friendCount = 0;
      this.randomPlayerCount = 0;
      iGames.map(iGame => {
        if (Number(iGame.gameOptions.opponentType) === OpponentType.Friend) {
          this.friendCount++;
        } else if (Number(iGame.gameOptions.opponentType) === OpponentType.Random) {
          this.randomPlayerCount++;
        }
        this.store.dispatch(this.userActions.loadOtherUserProfile(iGame.playerIds[0]));
      });
    }))


    this.gameInviteSliceStartIndex = 0;
    this.gameInviteSliceLastIndex = 3;

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
    this.checkCardCountPerRow();
  }

  displayMoreGameInvites(): void {
    this.gameInviteSliceLastIndex = (this.gameInvites.length > (this.gameInviteSliceLastIndex + 3)) ?
      this.gameInviteSliceLastIndex + 3 : this.gameInvites.length;
  }


  checkCardCountPerRow() {
    this.numbers = [];
    if (this.screenWidth > 1000 && this.screenWidth < 1200) {
      this.maxGameCardPerRow = 3;
    } else {
      this.maxGameCardPerRow = 4;
    }
    if (this.activeGames.length > 0) {
      if (this.activeGames.length < this.maxGameCardPerRow) {
        this.missingCardCount = this.maxGameCardPerRow - this.activeGames.length;
        this.numbers = Array(this.missingCardCount).fill(0).map((x, i) => i);
      } else if (this.activeGames.length > this.maxGameCardPerRow && this.activeGames.length <= this.gameSliceLastIndex) {
        const diff = Math.trunc(this.activeGames.length / this.maxGameCardPerRow);
        if (this.activeGames.length % this.maxGameCardPerRow !== 0) {
          this.missingCardCount = (diff + 1) * this.maxGameCardPerRow - this.activeGames.length;
          this.numbers = Array(this.missingCardCount).fill(0).map((x, i) => i);
        }

      }
    }
  }
  // @HostListener('window: resize', ['$event'])
  // onResize(event) {
  //   this.screenWidth = event.target.innerWidth;
  //   this.checkCardCountPerRow();
  // }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

}


