import { ViewChild } from "@angular/core";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";

export class DrawerPage {
    @ViewChild(RadSideDrawerComponent) protected drawerComponent: RadSideDrawerComponent;

    openDrawer() {
        if (this.drawerComponent && this.drawerComponent.sideDrawer) {
            this.drawerComponent.sideDrawer.showDrawer();
        }
    }

    onCloseDrawerTap() {
        if (this.drawerComponent && this.drawerComponent.sideDrawer) {
            this.drawerComponent.sideDrawer.closeDrawer();
        }
    }

}
