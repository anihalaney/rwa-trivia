import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, Inject } from "@angular/core";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Store} from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import {
    User, Category, Question, SearchResults, Game, LeaderBoardUser, OpponentType
} from 'shared-library/shared/model';
import { WindowRef } from 'shared-library/core/services';
import { AppState } from '../../../store';
import { Dashboard } from './../../../components/dashboard/dashboard';
import * as app from "application";



@Component({
    moduleId: module.id,
    selector: "ns-leaderboard",
    templateUrl: "leaderboard.component.html",
    styleUrls: ["leaderboard.component.scss"]
})
export class LeaderBoardComponent extends Dashboard implements OnInit {

    photoUrl = "../../../../assets/icons/icon-192x192.png";

    constructor(store: Store<AppState>,
        questionActions: QuestionActions,
        gameActions: GameActions,
        userActions: UserActions, windowRef: WindowRef,
        @Inject(PLATFORM_ID) platformId: Object) {
        super(store,
            questionActions,
            gameActions,
            userActions, windowRef,
            platformId);
    }

    ngOnInit() {

    }

    public openDrawer() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
