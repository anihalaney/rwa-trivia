import { Component, Input, OnInit, OnDestroy, HostListener, Inject, ChangeDetectorRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import {
  User, Category, Question, SearchResults, Game, LeaderBoardUser, OpponentType, GameStatus
} from 'shared-library/shared/model';
import { WindowRef } from 'shared-library/core/services';
import { AppState } from '../../store';
import { Dashboard } from './dashboard';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss']
})
export class DashboardComponent extends Dashboard implements OnInit {

  gameStatus: any;

  constructor(store: Store<AppState>,
    questionActions: QuestionActions,
    gameActions: GameActions,
    userActions: UserActions, windowRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object,
    private routerExtension: RouterExtensions
  ) {

    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId);
    this.gameStatus = GameStatus;

  }
  ngOnInit() {

  }

  startNewGame() {
    console.log('active games', this.activeGames);
    // this.routerExtension.navigate(['/game-play'], { clearHistory: true });
  }

}


