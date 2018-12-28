import { Component, EventEmitter, OnInit, Output, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'application';
import { Store, select } from '@ngrx/store';
import { User } from './../../../../shared/model';
import { CoreState, coreState } from '../../../../core/store';
import { AuthenticationProvider } from './../../../../core/auth/authentication.provider';
import { Utils } from './../../../../core/services';
import { ModalDialogService } from 'nativescript-angular/directives/dialogs';
import { Observable } from 'rxjs';
import { Category } from './../../../model';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'ns-drawer-component',
    templateUrl: 'drawer-component.html',
    styleUrls: ['drawer-component.css']

})
export class DrawerComponent implements OnInit {
    @Output() output = new EventEmitter();
    photoUrl = '~/assets/icons/icon-192x192.png';
    currentState;
    user: User;
    categoriesObs: Observable<Category[]>;
    categories: Category[];
    showSelectCategory: Boolean = true;
    activeMenu: String = 'Home';
    version: string;

    constructor(private routerExtension: RouterExtensions,
        private store: Store<CoreState>,
        public authProvider: AuthenticationProvider,
        private utils: Utils,
        private modal: ModalDialogService,
        private vcRef: ViewContainerRef,
        private router: Router
    ) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                const nav = val.url;
                if (nav.includes('/stats/leaderboard')) {
                    this.activeMenu = 'Category Leaderboard';
                } else if (nav === '/dashboard') {
                    this.activeMenu = 'Home';
                } else if (nav === '/my/recent-game') {
                    this.activeMenu = 'Recently Completed Games';
                } else if (nav.includes('/my/profile')) {
                    this.activeMenu = 'Profile Settings';
                } else if (nav === '/my/questions') {
                    this.activeMenu = 'My Questions';
                } else if (nav === '/my/invite-friends') {
                    this.activeMenu = 'Friend List';
                }
            }
        });
        this.categoriesObs = store.select(coreState).pipe(select(s => s.categories));
        this.categoriesObs.subscribe(categories => {
            this.categories = categories;
        });
    }
    ngOnInit() {

        this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
            this.photoUrl = this.utils.getImageUrl(user, 70, 60, '70X60');
        });


    }

    closeDrawer() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    leaderBoard(category) {
        this.routerExtension.navigate(['/stats/leaderboard', category]);
        this.closeDrawer();
    }

    dashboard() {
        this.routerExtension.navigate(['/dashboard'], { clearHistory: true });
        this.closeDrawer();
    }

    login() {
        this.routerExtension.navigate(['/login']);
        this.closeDrawer();
    }

    logout() {
        this.activeMenu = 'Home';
        this.authProvider.logout();
        this.routerExtension.navigate(['/dashboard'], { clearHistory: true });
        this.closeDrawer();
    }

    recentGame() {
        this.routerExtension.navigate(['/my/recent-game']);
        this.closeDrawer();
    }

    navigateToProfileSettings() {
        this.routerExtension.navigate(['/my/profile', this.user.userId]);
        this.closeDrawer();
    }

    navigateToMyQuestion() {
        this.routerExtension.navigate(['/my/questions']);
        this.closeDrawer();
    }

    navigateToFriendList() {
        this.routerExtension.navigate(['/my/invite-friends']);
        this.closeDrawer();
    }

}
