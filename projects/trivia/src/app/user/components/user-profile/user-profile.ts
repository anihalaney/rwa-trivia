import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, Category } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';
import { UserActions } from 'shared-library/core/store';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class UserProfile {
    // Properties
    subscriptions = [];
    user: User;
    categoryDict: { [key: number]: Category };
    categoryDictObs: Observable<{ [key: number]: Category }>;
    userDict$: Observable<{ [key: string]: User }>;
    userDict: { [key: string]: User } = {};
    userProfileImageUrl: any;
    socialProfileSettings: any;
    userId: any;
    loggedInUser: any;
    constructor(public store: Store<AppState>,
        public userAction: UserActions,
        public utils: Utils,
        public cd: ChangeDetectorRef,
        public route: ActivatedRoute) {
            this.route.params.subscribe(data => {
                if (data && data.userid) {
                    this.userId = data.userid;
                    this.initData();
                }
            });

    }

    initData() {
        this.subscriptions.push(this.store.select(appState.coreState).pipe(
            select(s => s.applicationSettings)).subscribe(appSettings => {
            this.socialProfileSettings = appSettings[0].social_profile;
        }));

        this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
            this.loggedInUser = user;
        }));

        this.categoryDictObs = this.store.select(categoryDictionary);
        this.subscriptions.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));

        this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
        this.subscriptions.push(this.userDict$.subscribe(userDict => {
            this.userDict = userDict;
            if (!this.userDict[this.userId] || !this.userDict[this.userId].account) {
                this.store.dispatch(this.userAction.loadOtherUserExtendedInfo(this.userId));
                this.cd.markForCheck();
            } else {
                this.user = this.userDict[this.userId];
                this.userProfileImageUrl = this.getImageUrl(this.user);
            }
            this.cd.markForCheck();
        }));
    }

    getImageUrl(user: User) {
        return this.utils.getImageUrl(user, 263, 263, '400X400');
    }

}
