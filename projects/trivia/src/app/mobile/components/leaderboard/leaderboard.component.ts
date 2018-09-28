import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
    moduleId: module.id,
    selector: "ns-leaderboard",
    templateUrl: "leaderboard.component.html",
    styleUrls: ["leaderboard.component.scss"]
})
export class LeaderBoardComponent implements AfterViewInit, OnInit {

    private _mainContentText: string;
    photoUrl = "../../../../assets/icons/icon-192x192.png";

    constructor(private _changeDetectionRef: ChangeDetectorRef) {
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
