import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from "application";

@Component({
    selector: 'ns-action-bar',
    moduleId: module.id,
    templateUrl: 'action-bar.component.html',
    styleUrls: ['action-bar.component.css']
})

export class ActionBarComponent {

    @Input() title;
    @Input() hideMenu;
    @Output() open: EventEmitter<any> = new EventEmitter<any>();

    openSidebar() {
        this.open.emit();
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

}
