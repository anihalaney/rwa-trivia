import { ActivatedRoute, Router } from '@angular/router';
import { skipWhile, map, flatMap, switchMap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState, appState } from '../../../store';
import { User, userCardType, Account, Invitation } from 'shared-library/shared/model';
import { Observable, Subject } from 'rxjs';
import { UserActions, categoryDictionary } from 'shared-library/core/store';
import { ChangeDetectorRef } from '@angular/core';
import { Utils } from 'shared-library/core/services';
import * as lodash from 'lodash';

export enum UserType {
    userProfile,
    loggedInOtherUserProfile,
    OtherUserProfile
}
export class GameProfile {
    gamePlayedChangeSubject = new Subject();
    gamePlayedChangeObservable = this.gamePlayedChangeSubject.asObservable();
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
    userProfileImageUrl = '';
    subscriptions = [];
    loggedInUserAccount: Account;
    gamePlayedAgainst: any;
    userInvitations: { [key: string]: Invitation };
    tags: any = {};
    tagsArray: any = {};
    loader: Boolean = false;
    categoryText = ' ';
    categoryDictionary = {};
    topics = [];
    otherUserTopics = [];
    topicList = '';
    otherUserTopicList = '';
    topicsArray = { userTopics: [], otherUserTopics: [], comparison: '' };
    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public store: Store<AppState>,
        public userAction: UserActions,
        public cd: ChangeDetectorRef,
        public _utils: Utils,
    ) {
        this.subscriptions.push(
            this.route.params.pipe(
                skipWhile(params => !params.userid),
                map(params => this.userId = params.userid),
                switchMap(() => this.store.select(categoryDictionary).pipe(map(categoryDict => this.categoryDictionary = categoryDict))),
                flatMap(() => this.store.select(appState.coreState).pipe(select(s => s.user))),
                switchMap(user => {
                    this.topics = [];
                    if (user && user.tags && user.tags.length > 0) {
                        this.tagsArray.userTags = user.tags;
                        const userTags = user.tags.join(', ');
                        this.tags.userTags = userTags ? userTags : '';
                        this.topics = [...user.tags];
                        this.topicsArray.userTopics = [...user.tags, ...user.categoryIds];
                    }
                    if (user && user.categoryIds && this.categoryDictionary) {
                        this.topics = [...this.topics, user.categoryIds.map((data) => this.categoryDictionary[data].categoryName)];
                    }

                    this.topicList = this.topics.join(', ');

                    if (user && user.userId === this.userId) {
                        this.user = user;
                        this.userType = UserType.userProfile;
                    } else {
                        this.userType = UserType.loggedInOtherUserProfile;
                        this.loggedInUser = user ? user : null;
                        this.store.select(appState.coreState).pipe(select(s => s.account),
                            skipWhile(account => !account || this.loggedInUserAccount === account)).subscribe(accountInfo => {
                                this.loggedInUserAccount = accountInfo;
                            });
                    }
                    this.cd.markForCheck();
                    return this.initializeProfile();
                })
            ).subscribe());
    }

    initializeProfile() {
        this.store.dispatch(this.userAction.loadOtherUserExtendedInfo(this.userId));
        return this.store.select(appState.coreState).pipe(
            select(s => s.userDict),
            skipWhile(userDict => !userDict || !userDict[this.userId] || !userDict[this.userId].account),
            take(1),
            map(userDict => {
                this.topics = [];
                this.user = userDict[this.userId];
                this.account = this.user.account;
                this.cd.markForCheck();
                this.gamePlayedAgainst = this.user.gamePlayed;
                if (this.gamePlayedAgainst && this.loggedInUser && this.loggedInUser.userId && this.userType === 1) {
                    this.gamePlayedChangeSubject.next(true);
                }
                if (this.user && this.user.tags && this.user.tags.length > 0) {
                    this.tagsArray.otherUserTags = this.user.tags;
                    this.topicsArray.otherUserTopics = [...this.user.tags, ...this.user.categoryIds];
                    this.topicsArray.comparison = lodash.intersection(this.topicsArray.userTopics, this.topicsArray.otherUserTopics);
                    const userTags = this.user.tags.join(', ');
                    this.tags.otherUserTags = userTags ? userTags : '';
                    this.otherUserTopics = [...this.user.tags];
                }
                this.otherUserTopics = [...this.otherUserTopics,
                this.user.categoryIds.map((data) => this.categoryDictionary[data].categoryName)];

                this.otherUserTopicList = this.otherUserTopics.join(', ');
                this.userProfileImageUrl = this.getImageUrl(this.user);
                if (this.socialProfileObj) {
                    this.socialProfileObj.map(profile => {
                        if (profile.enable) {
                            profile.socialUrl = `${profile.url}`;
                        }
                    });
                }
            }),
            flatMap(() => this.store.select(appState.coreState).pipe(select(s => s.userFriendInvitations),
                skipWhile(userInvitations => !(userInvitations)),
                map(userInvitations => {
                    this.userInvitations = userInvitations;
                    if (this.user && this.user.email && !this.userInvitations[this.user.email] && this.loggedInUser) {
                        this.store.dispatch(this.userAction.loadUserInvitationsInfo(
                            this.loggedInUser.userId, this.user.email, this.user.userId));
                    }
                }),
            )),
            flatMap(() => this.initializeSocialSetting()),
            map(() => this.cd.markForCheck()),
        );
    }

    getImageUrl(user: User) {
        return this._utils.getImageUrl(user, 263, 263, '400X400');
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

    get userInfo() {
        return {
            showEditOrOptions: this.userType === 0 ? 'edit' : this.userType === 1 ? 'options' : false,
            userId: this.user && this.user.userId ? this.user.userId : '',
            routing: '/user/my/profile'
        };
    }

    getIcon(icon) {
        return String.fromCharCode(parseInt(`0x${icon}`, 16));
    }

    startNewGame() {
        this.router.navigate(['/game-play/challenge/', this.user.userId]);
    }

    get isLivesEnable(): Boolean {
        const isEnable = (this.loggedInUser && this.loggedInUserAccount && this.loggedInUserAccount.lives > 0 &&
            this.applicationSettings.lives.enable) || (!this.applicationSettings.lives.enable) ? true : false;
        return isEnable;
    }

    sendFriendRequest() {
        this.loader = true;
        const inviteeUserId = this.user.userId;
        this.store.dispatch(this.userAction.addUserInvitation(
            { userId: this.loggedInUser.userId, inviteeUserId: inviteeUserId }));
    }
}
