import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";


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
        this.output.emit("close Drawer");
    }

    leaderBoard(){
        this.routerExtension.navigate(["/leaderboard"], { clearHistory: true });
    }

    dashboard() {
        this.routerExtension.navigate(["/dashboard"], { clearHistory: true });
    }
    
    login(){
        this.routerExtension.navigate(["/login"], { clearHistory: true });
    }
  
}
