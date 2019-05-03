import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { User, Category, profileSettingsConstants, Account } from 'shared-library/shared/model';
import { Utils, WindowRef } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary, getCategories, getTags } from '../../../store';
import { userState } from '../../../user/store';
import * as cloneDeep from 'lodash.clonedeep';
import * as userActions from '../../store/actions';
import { UserActions } from 'shared-library/core/store';
import { ViewChildren, QueryList, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { initDomAdapter } from '@angular/platform-browser/src/browser';
export enum UserType {
    userProfile,
    loggedInOtherUserProfile,
    OtherUserProfile
  }
export class ProfileSettings {
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
    profileImage: { image: any } = { image: '/assets/images/avatarimg.jpg' };
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
    singleFieldEdit = {
        displayName: false,
        location: false
    };

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

        this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
            this.socialProfileSettings = appSettings[0].social_profile;
            this.enableSocialProfile = this.socialProfileSettings.filter(profile => profile.enable).length;
        }));



        this.route.params.subscribe(data => {
            if (data && data.userid) {
                this.userId = data.userid;

                this.store.select(appState.coreState).pipe(skip(1)).subscribe(s => {
                    if (s.user) {
                        this.initData();
                    } else {
                        this.initializeOtherUserProfile();
                    }
                });
            }
        });

    }

    initData() {

        this.userObs = this.store.select(appState.coreState).pipe(select(s => s.user));

        this.subscriptions.push(this.userObs.subscribe(user => {
            if (user) {
                this.user = user;
                if (this.user.userId === this.userId) {
                    this.userType = UserType.userProfile;
                    this.initializeUserProfile();
                } else {
                    this.userType = UserType.loggedInOtherUserProfile;
                    this.initializeOtherUserProfile();
                }
            }
        }));
    }

    initializeUserProfile() {
        this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.account)).subscribe(account => {
            if (account) {
              this.account = account;
              this.cd.markForCheck();
            }
        }));

        this.categoriesObs = this.store.select(getCategories);
        this.subscriptions.push(this.categoriesObs.subscribe(categories => this.categories = categories));

        this.categoryDictObs = this.store.select(categoryDictionary);
        this.subscriptions.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));

        this.tagsObs = this.store.select(getTags);
        this.subscriptions.push(this.tagsObs.subscribe(tagsAutoComplete => this.tagsAutoComplete = tagsAutoComplete));

        this.userCopyForReset = cloneDeep(this.user);
        this.createForm(this.user);

        this.filteredTags$ = this.userForm.get('tags').valueChanges
            .pipe(map(val => val.length > 0 ? this.filter(val) : []));

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
    }

    initializeOtherUserProfile() {
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
                this.createForm(this.user);
                this.account = this.user.account;
                this.userProfileImageUrl = this.getImageUrl(this.user);
            }
            this.cd.markForCheck();
        }));
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

        this.afterFormCreate();
        if (!this.isEnableEditProfile) {
            this.disableForm(true);
        }
    }

    afterFormCreate() {
        if (this.socialProfileSettings) {
            this.socialProfileSettings.map(profile => {
                if (profile.enable) {
                    const socialName = this.user[profile.social_name] ? this.user[profile.social_name] : '';
                    this.userForm.addControl(profile.social_name, new FormControl(socialName, this.ValidateUrl));
                }
            });
            this.socialProfileSettings.sort((a, b) => a.position - b.position);
        }
    }

    getUserFromFormValue(formValue: any, isEditSingleField , field): void {
        if (isEditSingleField) {
            this.user[field] = formValue[field];
        } else {
            this.user.name = formValue.name;
            this.user.categoryIds = [];
            for (const obj of formValue.categoryList) {
                if (obj['isSelected']) {
                    this.user.categoryIds.push(obj['category']);
                }
            }
            this.socialProfileSettings.map(profile => {
                if (profile.enable) {
                    this.user[profile.social_name] = formValue[profile.social_name];
                }
            });
            this.user.tags = [...this.enteredTags];
            this.user.profilePicture = formValue.profilePicture ? formValue.profilePicture : '';
        }
    }

    showMoreSocialProfile() {
        this.socialProfileShowLimit = this.enableSocialProfile;
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

    editProfile() {
        this.isEnableEditProfile = true;
        this.enableForm();
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
}
