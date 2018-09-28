import { Component, Input, OnInit, OnDestroy, HostListener, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
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
import { Dashboard } from './dashboard';
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './dashboard.scss']
})
export class DashboardComponent extends Dashboard implements OnInit, OnDestroy {

  constructor(store: Store<AppState>,
    questionActions: QuestionActions,
    gameActions: GameActions,
    userActions: UserActions, windowRef: WindowRef,
    @Inject(PLATFORM_ID) platformId: Object,
    private _changeDetectionRef: ChangeDetectorRef, ) {

    super(store,
      questionActions,
      gameActions,
      userActions, windowRef,
      platformId);
    console.log('in child class');
  }

  @ViewChild('drawerComponent') public drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;

  ngAfterViewInit() {
    this.drawer = this.drawerComponent.sideDrawer;
    this._changeDetectionRef.detectChanges();
  }


  ngOnInit() {

  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

  public openDrawer() {
    this.drawer.showDrawer();
  }

  public onCloseDrawerTap() {
    this.drawer.closeDrawer();
  }

}


