import { Component, EventEmitter, OnInit, Output, ViewContainerRef, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import * as app from 'tns-core-modules/application';
import * as firebase from 'nativescript-plugin-firebase';
import { isAndroid } from 'tns-core-modules/platform';
import { Store, select } from '@ngrx/store';
import { User, ApplicationSettings, Parameter, DeviceToken, TriggerConstants, DrawerConstants } from './../../../../shared/model';
import { UserActions } from '../../../../core/store/actions';
import { CoreState, coreState } from '../../../../core/store';
import { AuthenticationProvider } from './../../../../core/auth/authentication.provider';
import { Utils } from './../../../../core/services';
import { Observable, Subscription } from 'rxjs';
import { Category } from './../../../model';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { projectMeta } from 'shared-library/environments/environment';

@Component({
    moduleId: module.id,
    selector: 'ns-drawer-component',
    templateUrl: 'drawer-component.html',
    styleUrls: ['drawer-component.css']

})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class DrawerComponent implements OnInit, OnDestroy {

    @ViewChild('ScrollList', { static: false }) scrollList: ElementRef;
    @Output() output = new EventEmitter();
    photoUrl = `~/assets/icons/${projectMeta.projectName}/icon-192x192.png`;
    currentState;
    user: User;
    categoriesObs: Observable<Category[]>;
    categories: Category[];
    showSelectCategory: Boolean = true;
    activeMenu: String = 'Home';
    version: string;
    logOut: boolean;
    pushToken: string;
    applicationSettings: ApplicationSettings;
    subscriptions = [];
    showHelp: Boolean = true;

    constructor(private routerExtension: RouterExtensions,
        private store: Store<CoreState>,
        public authProvider: AuthenticationProvider,
        private utils: Utils,
        private userActions: UserActions,
        private router: Router
    ) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                const nav = val.url;
                if (nav.includes('/dashboard/leaderboard')) {
                    this.activeMenu = 'Category Leaderboard';
                } else if (nav === '/dashboard') {
                    this.activeMenu = 'Home';
                } else if (nav === '/recent-game') {
                    this.activeMenu = 'Recently Completed Games';
                } else if (nav.includes('/user/my/profile')) {
                    this.activeMenu = 'Profile';
                } else if (nav.includes('/user/my/game-profile')) {
                    this.activeMenu = 'Game Profile';
                } else if (nav === '/user/my/questions') {
                    this.activeMenu = 'My Questions';
                } else if (nav === '/user/my/invite-friends') {
                    this.activeMenu = 'Friend List';
                } else if (nav === '/privacy-policy' || nav === '/terms-and-conditions' || nav === '/user-feedback') {
                    this.activeMenu = 'Help';
                } else if (nav === '/achievements') {
                    this.activeMenu = 'achievements';
                }

            }
        });
        this.categoriesObs = store.select(coreState).pipe(select(s => s.categories));
        this.categoriesObs.subscribe(categories => {
            this.categories = categories;
        });
        this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
            if (appSettings) {
                this.applicationSettings = appSettings[0];
            }
        }));

        this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userUpdateStatus)).subscribe(status => {
            if (status !== null) {
                switch (status) {
                    case DrawerConstants.UPDATE_TOKEN_STATUS:
                        this.authProvider.updateUserConnection();
                        break;
                    case DrawerConstants.LOGOUT:
                        this.resetValues();
                        break;
                }
            }
        }));

        this.subscriptions.push(this.categoriesObs);
    }
    ngOnInit() {
        this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user), filter(u => u !== null)).subscribe(user => {
            if (user && !this.logOut) {
                this.photoUrl = this.utils.getImageUrl(user, 70, 60, '70X60');
                this.user = user;
                if (!this.pushToken) {
                    firebase.getCurrentPushToken().then((token) => {
                        this.pushToken = token;
                        this.authProvider.updateDevicePushToken(token);
                        const deviceToken: DeviceToken = new DeviceToken();
                        deviceToken.token = token;
                        deviceToken.online = true;
                        if (isAndroid) {
                            user.androidPushTokens = (user.androidPushTokens) ? user.androidPushTokens : [];
                            if (user.androidPushTokens.length === 0 || user.androidPushTokens
                                .findIndex((androidPushToken) =>
                                    (androidPushToken === token ||
                                        (androidPushToken && androidPushToken.token && androidPushToken.token === token))) === -1) {
                                console.log('Android token', token);
                                user.androidPushTokens.push(deviceToken);
                                this.updateUser(user, DrawerConstants.UPDATE_TOKEN_STATUS);
                            } else {
                                this.authProvider.updateUserConnection();
                            }

                        } else {
                            user.iosPushTokens = (user.iosPushTokens) ? user.iosPushTokens : [];
                            if (user.iosPushTokens.length === 0 || user.iosPushTokens
                                .findIndex((iosPushToken) =>
                                    (iosPushToken === token ||
                                        (iosPushToken && iosPushToken.token && iosPushToken.token === token))) === -1) {
                                console.log('ios token', token);
                                user.iosPushTokens.push(deviceToken);
                                this.updateUser(user, DrawerConstants.UPDATE_TOKEN_STATUS);
                            } else {
                                this.authProvider.updateUserConnection();
                            }

                        }
                        this.user = user;
                    });
                }
            }
        }));
    }

    closeDrawer() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    leaderBoard(category) {
        this.routerExtension.navigate(['/dashboard/leaderboard', category]);
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
        this.logOut = true;
        this.setLogoutFirebaseAnalyticsParameter(this.user);
        if (isAndroid && this.user.androidPushTokens) {
            const index = this.user.androidPushTokens
                .findIndex((androidPushToken) =>
                    (androidPushToken === this.pushToken ||
                        (androidPushToken && androidPushToken.token && androidPushToken.token === this.pushToken)));
            if (index > -1) {
                this.user.androidPushTokens.splice(index, 1);
                this.updateUser(this.user, DrawerConstants.LOGOUT);
            } else {
                this.resetValues();
            }
        } else if (this.user.iosPushTokens) {
            const index = this.user.iosPushTokens
                .findIndex((iosPushToken) =>
                    (iosPushToken === this.pushToken ||
                        (iosPushToken && iosPushToken.token && iosPushToken.token === this.pushToken)));
            if (index > -1) {
                this.user.iosPushTokens.splice(index, 1);
                this.updateUser(this.user, DrawerConstants.LOGOUT);
            } else {
                this.resetValues();
            }
        } else {
            this.resetValues();
        }
    }

    setLogoutFirebaseAnalyticsParameter(user: User) {

        const analyticsParameter: Parameter[] = [];

        const userId: Parameter = {
            key: 'userId',
            value: user.userId
        };
        analyticsParameter.push(userId);

        console.log('analyticsParameter ==> ', analyticsParameter);

        firebase.analytics.logEvent({
            key: 'user_logout',
            parameters: analyticsParameter
        }).then(() => {
            console.log('user_logout event slogged');
        });

    }

    resetValues() {

        this.authProvider.logout();
        /* We have used Timeout because authprovide.logout() nullify object after some time */
        setTimeout(() => {
            this.logOut = false;
            this.pushToken = undefined;
            this.activeMenu = 'Home';
            this.closeDrawer();
            this.store.dispatch(this.userActions.loginSuccess(null));
            this.routerExtension.navigate(['/dashboard'], { clearHistory: true });
        }, 2000);

    }

    updateUser(user: User, status: string) {
        this.store.dispatch(this.userActions.updateUser(user, status));
    }

    recentGame() {
        this.routerExtension.navigate(['/recent-game']);
        this.closeDrawer();
    }

    navigateToProfileSettings() {
        this.routerExtension.navigate(['/user/my/profile', this.user.userId]);
        this.closeDrawer();
    }

    navigateToGameProfile() {
        this.routerExtension.navigate(['/user/my/game-profile', this.user.userId]);
        this.closeDrawer();
    }

    navigateToMyQuestion() {
        this.routerExtension.navigate(['/user/my/questions']);
        this.closeDrawer();
    }

    navigateToFriendList() {
        this.routerExtension.navigate(['/user/my/invite-friends']);
        this.closeDrawer();
    }

    navigateToPrivacyPolicy() {
        this.routerExtension.navigate(['/privacy-policy']);
        this.closeDrawer();
    }

    navigateToTermsConditions() {
        this.routerExtension.navigate(['/terms-and-conditions']);
        this.closeDrawer();
    }

    navigateToAchievements() {
        this.routerExtension.navigate(['/achievements']);
        this.closeDrawer();
    }

    navigateToUserFeedback() {
        this.routerExtension.navigate(['/user-feedback']);
        this.closeDrawer();
    }

    scrollToBottom() {
        // wait for the layout to be loaded before scroll to bottom
        setTimeout(() => {
            this.scrollList.nativeElement.scrollToVerticalOffset(this.scrollList.nativeElement.scrollableHeight, true);
        }, 100);
    }

    ngOnDestroy(): void {

    }
}
