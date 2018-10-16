import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "application";
import { Store, select } from '@ngrx/store';
import { appState } from './../../../../../../../trivia/src/app/store';
import { User } from './../../../../shared/model';
import { CoreState } from '../../../../core/store';
import { AuthenticationProvider } from './../../../../core/auth/authentication.provider';
import { Utils } from './../../../../core/services'
@Component({
    moduleId: module.id,
    selector: "ns-drawer-component",
    templateUrl: "drawer-component.html",
    styleUrls: ["drawer-component.css"]

})
export class DrawerComponent implements OnInit {
    @Output() output = new EventEmitter();
    photoUrl = "~/assets/icons/icon-192x192.png";
    currentState;
    user: User;

    version: string;

    constructor(private routerExtension: RouterExtensions,
        private store: Store<CoreState>,
        private authProvider: AuthenticationProvider,
        private utils: Utils,
    ) {

    }
    ngOnInit() {

        this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
            this.photoUrl = this.utils.getImageUrl(user, 70, 60, '70X60');
        })

    }

    closeDrawer() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    leaderBoard() {
        this.routerExtension.navigate(["/stats/leaderboard"], { clearHistory: true });
        this.closeDrawer();
    }

    dashboard() {
        this.routerExtension.navigate(["/dashboard"], { clearHistory: true });
        this.closeDrawer();
    }

    login() {
        this.routerExtension.navigate(["/login"], { clearHistory: true });
        this.closeDrawer();
    }

    logout() {
        this.authProvider.logout();
        this.closeDrawer();
    }



}
