import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from "application";
import { ios } from "tns-core-modules/application/application";
import * as frameModule from "ui/frame";

@Component({
    selector: "ns-action-bar",
    moduleId: module.id,
    templateUrl: "action-bar.component.html",
    styleUrls: ["action-bar.component.css"]
})

export class ActionBarComponent implements OnInit {

    @Input() title;
    @Output() open: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {
    }

    openSidebar() {
        this.open.emit();
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

}
