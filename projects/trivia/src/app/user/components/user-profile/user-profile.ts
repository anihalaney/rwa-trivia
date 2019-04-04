import { FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, Category, profileSettingsConstants } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';
import { UserActions } from 'shared-library/core/store';
import { ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class UserProfile {
    @ViewChildren('myInput') inputEl: QueryList<any>;
    // Properties
    user: User;

    categories: Category[];
    userCategories: Category[];
    categoryDict: { [key: number]: Category };
    categoryDictObs: Observable<{ [key: number]: Category }>;
    categoriesObs: Observable<Category[]>;
    userObs: Observable<User>;
    profileImage: { image: any } = { image: '/assets/images/avatarimg.jpg' };
    tagsObs: Observable<string[]>;
    tags: string[];
    tagsAutoComplete: string[];
    enteredTags: string[] = [];
    filteredTags$: Observable<string[]>;
    tagsArrays: String[];
    NONE = profileSettingsConstants.NONE;
    PENDING = profileSettingsConstants.PENDING;
    APPROVED = profileSettingsConstants.APPROVED;
    bulkUploadBtnText: string;
    loaderBusy = false;
    subscriptions = [];

    userDict$: Observable<{ [key: string]: User }>;
    otherUserId: string;
    userDict: { [key: string]: User } = {};
    account: any;
    userProfileImageUrl: any;
    socialProfileSettings: any;
    userId: any;
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

        this.categoryDictObs = this.store.select(categoryDictionary);
        this.subscriptions.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));

        this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
        this.subscriptions.push(this.userDict$.subscribe(userDict => {
            this.userDict = userDict;
            if (!this.userDict[this.userId] || !this.userDict[this.userId].account) {
                this.store.dispatch(this.userAction.loadOtherUserAllProfile(this.userId));
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
