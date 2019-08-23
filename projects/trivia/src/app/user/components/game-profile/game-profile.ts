import { ActivatedRoute, Router } from '@angular/router';
import { skipWhile, map, flatMap, switchMap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState, appState } from '../../../store';
import { User, userCardType, Account } from 'shared-library/shared/model';
import { Observable } from 'rxjs';
import { UserActions } from 'shared-library/core/store';
import { ChangeDetectorRef } from '@angular/core';

export enum UserType {
    userProfile,
    loggedInOtherUserProfile,
    OtherUserProfile
}

export class GameProfile {
    user: User;
    userDict: { [key: string]: User } = {};
    userDict$: Observable<{ [key: string]: User }>;
    userId = '';
    loggedInUser: User;
    account: Account;
    applicationSettings: any;
    socialProfileObj: any;
    userType = UserType.OtherUserProfile;
    userCardType = userCardType;
    socialProfileSettings;
    enableSocialProfile;
    subscriptions = [];
    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public store: Store<AppState>,
        public userAction: UserActions,
        public cd: ChangeDetectorRef
    ) {
        console.log(String.fromCharCode(0xf041));
        this.subscriptions.push(
            this.route.params.pipe(
                skipWhile(params => !params.userid),
                map(params => this.userId = params.userid),
                flatMap(() => this.store.select(appState.coreState).pipe(select(s => s.user))),
                switchMap(user => {
                    if (user && user.userId === this.userId) {
                        this.user = user;
                        this.userType = UserType.userProfile;
                    } else {
                        this.userType = UserType.loggedInOtherUserProfile;
                    }
                    return this.initializeUserProfile();
                })
            ).subscribe());
    }

    initializeUserProfile() {
        this.store.dispatch(this.userAction.loadOtherUserExtendedInfo(this.userId));
        return this.store.select(appState.coreState).pipe(
            select(s => s.userDict),
            skipWhile(userDict => !userDict || !userDict[this.userId] || !userDict[this.userId].account),
            take(1),
            map(userDict => {
                this.user = userDict[this.userId];
                this.account = this.user.account;
                if (this.socialProfileObj) {
                    this.socialProfileObj.map(profile => {
                        if (profile.enable) {
                            profile.socialUrl = `${profile.url}`;
                        }
                    });
                }
            }),
            flatMap(() => this.initializeSocialSetting())
        );
    }

    initializeSocialSetting() {
        return this.store.select(appState.coreState)
            .pipe(select(s => s.applicationSettings),
                map(appSettings => {
                    if (appSettings[0]) {
                        this.applicationSettings = { ...appSettings[0] };
                        this.socialProfileObj = [...appSettings[0].social_profile];
                        this.socialProfileSettings = appSettings[0].social_profile
                            .filter(profile =>
                                this.user &&
                                this.user[profile.social_name]
                                && this.user[profile.social_name] !== '');
                        this.enableSocialProfile = this.socialProfileSettings.filter(profile => profile.enable).length;
                        if (this.socialProfileObj) {
                            this.socialProfileObj.map(profile => {
                                if (profile.enable) {
                                    const socialName = this.user[profile.social_name] ? this.user[profile.social_name] : '';
                                    profile.socialUrl = `${profile.url}${socialName}`;
                                }
                            });
                        }
                        this.cd.markForCheck();
                    }

                }));
    }

    getIcon(icon) {
        return String.fromCharCode(parseInt(`0x${icon}`, 16));
    }
}
