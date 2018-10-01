import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, Inject } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';


import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import * as gameplayactions from './../../../game-play/store/actions';
import {
    User, Category, Question, SearchResults, Game, LeaderBoardUser, OpponentType
} from 'shared-library/shared/model';
import { Utils, WindowRef } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';
import { Dashboard } from './../../../components/dashboard/dashboard';
@Component({
    moduleId: module.id,
    selector: "ns-leaderboard",
    templateUrl: "leaderboard.component.html",
    styleUrls: ["leaderboard.component.scss"]
})
export class LeaderBoardComponent extends Dashboard implements AfterViewInit, OnInit {

    private _mainContentText: string;
    photoUrl = "../../../../assets/icons/icon-192x192.png";

    // constructor(private _changeDetectionRef: ChangeDetectorRef) {
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
    }

    @ViewChild('drawerComponent') public drawerComponent: RadSideDrawerComponent;
    private drawer: RadSideDrawer;

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    ngOnInit() {

    }


    public openDrawer() {
        this.drawer.showDrawer();
    }

    public onCloseDrawerTap() {
        this.drawer.closeDrawer();
    }



}
