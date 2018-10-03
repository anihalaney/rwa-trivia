import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import * as app from "application";

@Component({
    moduleId: module.id,
    selector: "ns-drawer-component",
    templateUrl: "drawer-component.html",
    styleUrls: ["drawer-component.css"]

})
export class DrawerComponent implements OnInit {
    @Output() output = new EventEmitter();
    photoUrl= "~/assets/icons/icon-192x192.png";
    // ~/assets/icons/icon-192x192/png
    firstName = "Daniel";
    lastName = "Chi";
    place = "US"
    currentState;

    version: string;

    constructor(private routerExtension: RouterExtensions,
    ) {

    }
    ngOnInit() {

    }

    closeDrawer() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    leaderBoard(){
        this.routerExtension.navigate(["/leaderboard"], { clearHistory: true });
        this.closeDrawer();
    }

    dashboard() {
        this.routerExtension.navigate(["/dashboard"], { clearHistory: true });
        this.closeDrawer();
    }
    
    login(){
        this.routerExtension.navigate(["/login"], { clearHistory: true });
        this.closeDrawer();
    }

    
  
}
