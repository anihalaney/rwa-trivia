import { ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as cloneDeep from 'lodash.clonedeep';
import { combineLatest, Observable, Subject } from 'rxjs';
import { flatMap, map, skipWhile, switchMap } from 'rxjs/operators';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store';
import { Account, Category, profileSettingsConstants, User } from 'shared-library/shared/model';
import { AppState, appState, categoryDictionary, getCategories, getTags } from '../../../store';
import * as userActions from '../../store/actions';

export enum UserType {
    userProfile,
    loggedInOtherUserProfile,
    OtherUserProfile
}

export class ProfileSettings {
    gamePlayedChangeSubject = new Subject();
    gamePlayedChangeObservable = this.gamePlayedChangeSubject.asObservable();

    @ViewChildren('myInput') inputEl: QueryList<any>;
    // Properties
    user: User;
    fb: FormBuilder;
    categories: Category[];
    userCategories: Category[];
    categoryDict: { [key: number]: Category };
    categoryDictObs: Observable<{ [key: number]: Category }>;
    categoriesObs: Observable<Category[]>;
    userForm: FormGroup;
    userObs: Observable<User>;
    profileOptions: string[] = ['Only with friends', 'With EveryOne'];
    locationOptions: string[] = ['Only with friends', 'With EveryOne'];
    socialProfileSettings;
    enableSocialProfile;
    profileImage: { image: any } = { image: '/assets/images/default-avatar-small.png' };
    profileImageValidation: String;
    profileImageFile: File;
    userCopyForReset: User;
    socialProfileShowLimit = 3;

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
    account: Account;
    userId = '';
    userDict$: Observable<{ [key: string]: User }>;
    userDict: { [key: string]: User } = {};
    userProfileImageUrl = '';
    userType = UserType.OtherUserProfile;
    isEnableEditProfile = false;
    socialProfileObj: any;
    singleFieldEdit = {
        displayName: false,
        location: false
    };
    loggedInUser: User;
    gamePlayedAgainst: any;
    // tslint:disable-next-line:quotemark
    linkValidation = "^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$";

    constructor(public formBuilder: FormBuilder,
        public store: Store<AppState>,
        public userAction: UserActions,
        public utils: Utils,
        public cd: ChangeDetectorRef,
        public route: ActivatedRoute) {
        this.toggleLoader(true);
        this.fb = formBuilder;
        this.tagsObs = this.store.select(getTags);
        this.subscriptions.push(this.tagsObs.subscribe(tagsAutoComplete => this.tagsAutoComplete = tagsAutoComplete));

        this.subscriptions.push(
            this.route.params.pipe(
                skipWhile(params => !params.userid),
                map(params => this.userId = params.userid),
                flatMap(() => this.store.select(appState.coreState).pipe(select(s => s.user))),
                switchMap(user => {
                    if (user && user.userId === this.userId) {
                        this.user = user;
                        this.userType = UserType.userProfile;
                        return this.initializeUserProfile();
                    } else {
                        this.userType = UserType.loggedInOtherUserProfile;
                        return this.initializeOtherUserProfile(user);
                    }
                })
            ).subscribe());
    }

    initializeSocialSetting() {
        return this.store.select(appState.coreState)
            .pipe(select(s => s.applicationSettings),
                map(appSettings => {
                    this.socialProfileObj = [...appSettings[0].social_profile];
                    this.socialProfileSettings = appSettings[0].social_profile
                        .filter(profile =>
                            this.user &&
                            this.user[profile.social_name]
                            && this.user[profile.social_name] !== '');
                    this.enableSocialProfile = this.socialProfileSettings.filter(profile => profile.enable).length;
                }));
    }

    showAllSocialSetting() {
        this.socialProfileSettings = [...this.socialProfileObj];
        this.enableSocialProfile = this.socialProfileSettings.filter(profile => profile.enable).length;
    }

    initializeUserProfile() {
        return combineLatest(
            this.store.select(appState.coreState).pipe(select(s => s.account)),
            this.store.select(getCategories),
            this.store.select(categoryDictionary),
            this.initializeSocialSetting(),
        ).pipe(map(values => {
            this.account = values[0] || new Account();
            this.categories = values[1] || [];
            this.categoryDict = values[2] || {};

            this.userCopyForReset = cloneDeep(this.user);
            this.createForm(this.user);

            if (this.user.profilePictureUrl) {
                this.profileImage.image = this.user.profilePictureUrl;
            }

            switch (this.user.bulkUploadPermissionStatus) {
                case this.NONE: { this.bulkUploadBtnText = profileSettingsConstants.BULK_UPLOAD_REQUEST_BTN_TEXT; break; }
                case this.PENDING: { this.bulkUploadBtnText = profileSettingsConstants.BULK_UPLOAD_SEND_REQUEST_AGAIN_BTN_TEXT; break; }
                default: { this.bulkUploadBtnText = profileSettingsConstants.BULK_UPLOAD_REQUEST_BTN_TEXT; break; }
            }
            if (this.user.roles && this.user.roles['bulkuploader']) {
                this.user.bulkUploadPermissionStatus = profileSettingsConstants.APPROVED;
            }
            this.toggleLoader(false);
            this.cd.markForCheck();
        }));
    }

    initializeOtherUserProfile(user) {
        return this.store.select(appState.coreState).pipe(
            select(s => s.userDict),
            skipWhile(userDict => !userDict),
            map(userDict => {
                this.userDict = userDict;
                if ( user && !this.loggedInUser ) {
                    this.loggedInUser = user;
                    this.store.dispatch(this.userAction.loadOtherUserFriendExtendedInfo(this.userId));
                } else if (!this.userDict[this.userId] || !this.userDict[this.userId].account) {
                    this.store.dispatch(this.userAction.loadOtherUserExtendedInfo(this.userId));
                } else {
                    this.user = this.userDict[this.userId];
                    this.createForm(this.user);
                    this.account = this.user.account;
                    this.gamePlayedAgainst = this.user.gamePlayed;
                    if (this.gamePlayedAgainst && this.loggedInUser && this.loggedInUser.userId && this.userType === 1) {
                        this.gamePlayedChangeSubject.next(true);
                    }
                    this.userProfileImageUrl = this.getImageUrl(this.user);
                    this.profileImage.image = this.userProfileImageUrl;
                    this.toggleLoader(false);
                }
            }),
            flatMap(() => this.initializeSocialSetting()),
            map(() => this.cd.markForCheck())
        );
    }
    get tagsArray(): FormArray {
        return this.userForm.get('tagsArray') as FormArray;
    }

    get categoryList(): FormArray {
        return this.userForm.get('categoryList') as FormArray;
    }

    get socialAccountList(): FormArray {
        return this.userForm.get('socialAccountList') as FormArray;
    }

    ValidateUrl(control: AbstractControl) {
        if (control.value.toLowerCase().includes('http') || control.value.toLowerCase().includes('www')) {
            return { validUrl: true };
        }
        return null;
    }

    filter(val: string): string[] {
        return this.tagsAutoComplete.filter(option => new RegExp(this.utils.regExpEscape(`${val}`), 'gi').test(option));
    }

    toggleLoader(flag: boolean) {
        this.loaderBusy = flag;
    }

    // create the form based on user object
    createForm(user: User) {
        let tagsFA, categoryFA;

        if (this.userType === 0) {
            const categoryIds: FormGroup[] = this.categories.map(category => {
                const status = (user.categoryIds && user.categoryIds.indexOf(category.id) !== -1) ? true : false;
                const fg = new FormGroup({
                    category: new FormControl(category.id),
                    isSelected: new FormControl(status),
                });
                return fg;
            });

            this.userCategories = this.categories.map((category) => {
                category.isSelected = (user.categoryIds && user.categoryIds.indexOf(category.id) !== -1) ? true : false;
                return category;
            });

            if (user.tags === undefined) {
                const a = [];
                user.tags = a;
            }

            let fcs: FormControl[] = user.tags.map(tag => {
                const fc = new FormControl(tag);
                return fc;
            });
            if (fcs.length === 0) {
                fcs = [new FormControl('')];
            }
            tagsFA = new FormArray(fcs);

            categoryFA = new FormArray(categoryIds);
            this.enteredTags = user.tags;
        }
        this.userForm = this.fb.group({
            name: [user.name, Validators.required],
            displayName: [user.displayName],
            location: [user.location],
            categoryList: categoryFA ? categoryFA : [],
            tags: '',
            tagsArray: tagsFA ? tagsFA : [],
            profilePicture: [user.profilePicture]
        });

        this.filteredTags$ = this.userForm.get('tags').valueChanges
            .pipe(map(val => val.length > 0 ? this.filter(val) : []));

        this.createSocialProfileControl();
        if (!this.isEnableEditProfile) {
            this.disableForm(true);
        }
    }

    createSocialProfileControl() {
        if (this.socialProfileObj) {
            this.socialProfileObj.map(profile => {
                if (profile.enable) {
                    const socialName = this.user[profile.social_name] ? this.user[profile.social_name] : '';
                    this.userForm.addControl(profile.social_name, new FormControl(socialName, this.ValidateUrl));
                }
            });
            this.socialProfileObj.sort((a, b) => a.position - b.position);
        }
    }

    getUserFromFormValue(isEditSingleField, field): void {
        if (isEditSingleField) {
            this.user[field] = this.userForm.get(field).value;
        } else {
            this.user.name = this.userForm.get('name').value;
            this.user.categoryIds = [];

            for (const obj of this.userForm.get('categoryList').value) {
                if (obj['isSelected']) {
                    this.user.categoryIds.push(obj['category']);
                }
            }
            this.socialProfileObj.map(profile => {
                if (profile.enable) {
                    this.user[profile.social_name] = this.userForm.get(profile.social_name).value;
                }
            });
            this.user.tags = [...this.enteredTags];
            this.user.profilePicture = this.userForm.get('profilePicture').value ? this.userForm.get('profilePicture').value : '';
        }
    }

    resetUserProfile() {
        this.user = cloneDeep(this.userCopyForReset);
        this.createForm(this.user);
        this.filteredTags$ = this.userForm.get('tags').valueChanges
            .pipe(map(val => val.length > 0 ? this.filter(val) : []));
    }

    // store the user object
    saveUser(user: User) {
        this.toggleLoader(true);
        this.isEnableEditProfile = false;
        this.disableForm();
        this.store.dispatch(this.userAction.addUserProfile(user));
    }

    onSocialProfileInputFocus(i) {
        this.inputEl.toArray()[i].nativeElement.focus();
    }

    getImageUrl(user: User) {
        return this.utils.getImageUrl(user, 263, 263, '400X400');
    }

    disableForm(isDisableAll = false) {
        if (isDisableAll) {
            this.userForm.disable();
        } else {
            const controls = this.userForm.controls;
            const singleEditFields = Object.getOwnPropertyNames(this.singleFieldEdit);
            for (const name in controls) {
                if (singleEditFields.indexOf(name) < 0) {
                    this.userForm.get(name).disable();
                }
            }
        }
    }

    editProfile() {
        this.isEnableEditProfile = true;
        this.showAllSocialSetting();
        this.enableForm();
    }

    showMoreSocialProfile() {
        this.socialProfileShowLimit = this.enableSocialProfile;
    }

    enableForm() {
        const controls = this.userForm.controls;
        const singleEditFields = Object.getOwnPropertyNames(this.singleFieldEdit);
        for (const name in controls) {
            if (singleEditFields.indexOf(name) < 0) {
                this.userForm.get(name).enable();
            }
        }
    }

    editSingleField(field: string) {
        this.singleFieldEdit[field] = !this.singleFieldEdit[field];
        if (this.singleFieldEdit[field]) {
            this.userForm.get(field).enable();
            this.userForm.get(field).setValidators([Validators.required]);
            this.userForm.updateValueAndValidity();
        } else {
            this.userForm.get(field).disable();
            this.userForm.get(field).setValidators([]);
            this.userForm.updateValueAndValidity();
        }
    }

    checkDisplayName(displayName: string) {
        this.store.dispatch(new userActions.CheckDisplayName(displayName));
    }

    sendFriendRequest() {
        const inviteeUserId = this.user.userId;
        this.store.dispatch(this.userAction.addUserInvitation(
            { userId: this.loggedInUser.userId, inviteeUserId: inviteeUserId }));
    }
}
