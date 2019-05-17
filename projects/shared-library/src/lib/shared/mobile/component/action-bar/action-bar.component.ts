import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
    selector: 'ns-action-bar',
    moduleId: module.id,
    templateUrl: 'action-bar.component.html',
    styleUrls: ['action-bar.component.css']
})

export class ActionBarComponent {

    @Input() title;
    @Input() hideMenu;
    @Input() hideHomeIcon;
    @Output() open: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private routerExtensions: RouterExtensions,
    ) {
    }

    openSidebar() {
        this.open.emit();
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }


    goToDashboard() {
        this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
    }

}
