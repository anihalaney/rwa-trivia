import { Component, Input, OnInit, OnDestroy, HostListener, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Store} from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from '../../../../../shared-library/src/lib/core/store/actions';
import {
  User, Category, Question, SearchResults, Game, LeaderBoardUser, OpponentType
} from '../../../../../shared-library/src/lib/shared/model';
import { Utils, WindowRef } from '../../../../../shared-library/src/lib/core/services';
import { AppState } from '../../store';
import { Dashboard } from './dashboard';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss']
})
export class DashboardComponent extends Dashboard implements OnInit {

  constructor(store: Store<AppState>,
    questionActions: QuestionActions,
    gameActions: GameActions,
    userActions: UserActions, windowRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object,
    private utils: Utils) {

    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId);

  }
  ngOnInit() {

  }

}


