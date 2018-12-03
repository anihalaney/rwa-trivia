import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User, Category, profileSettingsConstants } from 'shared-library/shared/model';
import { Utils, WindowRef } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary, getCategories, getTags } from '../../../store';
import { userState } from '../../../user/store';
import * as cloneDeep from 'lodash.clonedeep';
import * as userActions from '../../store/actions';

export class ProfileSettings {
    // Properties
    user: User;
    fb: FormBuilder;
    categories: Category[];
    userCategories: Category[];
    categoryDict: { [key: number]: Category };
    categoryDictObs: Observable<{ [key: number]: Category }>;
    subs: Subscription[] = [];
    categoriesObs: Observable<Category[]>;
    userForm: FormGroup;
    userObs: Observable<User>;
    profileOptions: string[] = ['Only with friends', 'With EveryOne'];
    locationOptions: string[] = ['Only with friends', 'With EveryOne'];


    profileImage: { image: any } = { image: '/assets/images/avatarimg.jpg' };
    profileImageValidation: String;
    profileImageFile: File;
    userCopyForReset: User;

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

    // tslint:disable-next-line:quotemark
    linkValidation = "^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$";



    constructor(public formBuilder: FormBuilder,
        public store: Store<AppState>,
        public utils: Utils) {

        this.toggleLoader(true);

        this.fb = formBuilder;

        this.categoriesObs = store.select(getCategories);
        this.subs.push(this.categoriesObs.subscribe(categories => this.categories = categories));

        this.categoryDictObs = store.select(categoryDictionary);
        this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));

        this.tagsObs = this.store.select(getTags);
        this.subs.push(this.tagsObs.subscribe(tagsAutoComplete => this.tagsAutoComplete = tagsAutoComplete));

        this.userObs = this.store.select(appState.coreState).pipe(select(s => s.user));

        this.subs.push(this.userObs.subscribe(user => {
            if (user) {
                this.user = user;

                this.userCopyForReset = cloneDeep(user);
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

                if (user.roles && user.roles['bulkuploader']) {
                    this.user.bulkUploadPermissionStatus = profileSettingsConstants.APPROVED;
                }

                this.toggleLoader(false);
            }
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

    filter(val: string): string[] {
        return this.tagsAutoComplete.filter(option => new RegExp(this.utils.regExpEscape(`${val}`), 'gi').test(option));
    }

    toggleLoader(flag: boolean) {
        this.loaderBusy = flag;
    }

    // create the form based on user object
    createForm(user: User) {
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
        const tagsFA = new FormArray(fcs);

        const categoryFA = new FormArray(categoryIds);
        this.userForm = this.fb.group({
            name: [user.name, Validators.required],
            displayName: [user.displayName, Validators.required],
            location: [user.location, Validators.required],
            categoryList: categoryFA,
            tags: '',
            tagsArray: tagsFA,
            facebookUrlStatus: [true],
            facebookUrl: [user.facebookUrl, Validators.pattern(this.linkValidation)],
            twitterUrlStatus: [true],
            twitterUrl: [user.twitterUrl, Validators.pattern(this.linkValidation)],
            linkedInUrlStatus: [true],
            linkedInUrl: [user.linkedInUrl, Validators.pattern(this.linkValidation)],
            profileSetting: [(user.profileSetting) ? user.profileSetting :
                (this.profileOptions.length > 0 ? this.profileOptions[0] : '')],
            profileLocationSetting: [(user.profileLocationSetting) ? user.profileLocationSetting :
                (this.locationOptions.length > 0 ? this.locationOptions[0] : '')],
            privateProfileSetting: [user.privateProfileSetting],
            profilePicture: [user.profilePicture, Validators.required]
        });
        this.enteredTags = user.tags;
    }

    getUserFromFormValue(formValue: any): void {
        this.user.name = formValue.name;
        this.user.displayName = formValue.displayName;
        this.user.location = formValue.location;
        this.user.categoryIds = [];
        for (const obj of formValue.categoryList) {
            if (obj['isSelected']) {
                this.user.categoryIds.push(obj['category']);
            }
        }
        this.user.facebookUrl = formValue.facebookUrl;
        this.user.linkedInUrl = formValue.linkedInUrl;
        this.user.twitterUrl = formValue.twitterUrl;
        this.user.tags = [...this.enteredTags];
        this.user.profileSetting = formValue.profileSetting;
        this.user.profileLocationSetting = formValue.profileLocationSetting;
        this.user.privateProfileSetting = formValue.privateProfileSetting;
        this.user.profilePicture = formValue.profilePicture ? formValue.profilePicture : '';
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
        this.store.dispatch(new userActions.AddUserProfile({ user: user }));
    }

}
