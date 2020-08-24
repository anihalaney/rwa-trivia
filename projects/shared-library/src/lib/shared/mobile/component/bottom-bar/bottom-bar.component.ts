import { Component, EventEmitter, Input, Output, OnDestroy, OnChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { CoreState, coreState } from '../../../../core/store';
import { User } from 'shared-library/shared/model';
import { Router, NavigationEnd } from '@angular/router';


@Component({
    selector: 'bottom-bar',
    moduleId: module.id,
    templateUrl: 'bottom-bar.component.html',
    styleUrls: ['bottom-bar.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class BottomBarComponent implements OnChanges, OnDestroy, OnInit {

    user: User;
    subscriptions = [];
    activeMenu = 'play';
    animateMenu = '';
    prevMenu = '';
    @Input() isDrawerOpenOrClosed = 'drawerClosed';
    @Input() screen = undefined;
    @Output() open: EventEmitter<any> = new EventEmitter<any>();


    constructor(
        private routerExtensions: RouterExtensions,
        public store: Store<CoreState>,
        public router: Router,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
        }));

        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                const nav = val.url;
                if (this.isDrawerOpenOrClosed === 'drawerClosed' || !this.isDrawerOpenOrClosed) {
                    this.bottomBarNavigationOnRouting(nav);
                }
            }
        });

    }

    ngOnChanges() {
        if (this.isDrawerOpenOrClosed === 'drawerClosed' || !this.isDrawerOpenOrClosed) {
            this.bottomBarNavigationOnRouting(this.router.url);
        } else {
            this.activeMenu = 'more';
        }
    }

    bottomBarNavigationOnRouting(url) {
        if (url === '/dashboard' || url === '/' || url.includes('game-play/game-options')) {
            this.activeMenu = 'play';
        } else if (url === '/dashboard/leaderboard') {
            this.activeMenu = 'leaderboard';
        } else if (url === '/user/my/invite-friends') {
            this.activeMenu = 'friends';
        } else {
            this.activeMenu = 'more';
        }
    }

    bottomBarClick(menu) {
        const sideDrawer = this.radSideDrawer();
        if (menu === 'play') {
            this.activeMenu = menu;
            this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
            sideDrawer.closeDrawer();
        } else if (menu === 'leaderboard') {
            this.activeMenu = menu;
            this.routerExtensions.navigate(['/dashboard/leaderboard'], { clearHistory: true });
            sideDrawer.closeDrawer();
        } else if (menu === 'friends') {
            this.routerExtensions.navigate(['/user/my/invite-friends'], { clearHistory: true });
            if (this.router.url === '/user/my/invite-friends') {
                console.log('called');
                this.activeMenu = menu;
            }
            sideDrawer.closeDrawer();
        } else if (menu === 'more') {
            this.activeMenu = menu;
            this.open.emit();
            sideDrawer.showDrawer();
        } else if (menu === 'less') {
            sideDrawer.closeDrawer();
        }
        if (menu !== 'more') {
            this.prevMenu = this.animateMenu !== '' || this.animateMenu == undefined ? this.animateMenu : 'play';
            this.animateMenu = menu;
        } else {
            this.prevMenu = undefined;
            this.animateMenu = undefined;
        }
        this.cd.markForCheck();
    }

    radSideDrawer() {
        return <RadSideDrawer>app.getRootView();
    }

    goToDashboard() {
        this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
    }

    ngOnDestroy() {

    }

}
