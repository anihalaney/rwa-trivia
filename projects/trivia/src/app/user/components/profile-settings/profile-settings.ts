import {
  ChangeDetectorRef,
  QueryList,
  ViewChildren,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
// import * as cloneDeep from "lodash.clonedeep";
import { combineLatest, Observable, Subject } from 'rxjs';
import {
  flatMap,
  map,
  skipWhile,
  switchMap,
  take,
  filter
} from 'rxjs/operators';
import { Utils } from 'shared-library/core/services';
import { UserActions, getTopTopics } from 'shared-library/core/store';
import {
  Account,
  Category,
  profileSettingsConstants,
  User,
  Invitation,
  AuthProviderConstants,
  Topic
} from 'shared-library/shared/model';
import {
  AppState,
  appState,
  categoryDictionary,
  getCategories,
  getTags
} from '../../../store';
// import * as userActions from "../../store/actions";
import { AuthenticationProvider } from 'shared-library/core/auth';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

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
  topics: Topic[];
  categoriesObs: Observable<Category[]>;
  userForm: FormGroup;
  userObs: Observable<User>;
  profileOptions: string[] = ['Only with friends', 'With EveryOne'];
  locationOptions: string[] = ['Only with friends', 'With EveryOne'];
  socialProfileSettings;
  enableSocialProfile;
  profileImage: { image: any } = {
    image: '/assets/images/default-avatar-small.png'
  };
  profileImageValidation: String;
  profileImageFile: File;
  userCopyForReset: User;
  socialProfileShowLimit = 5;

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
  userProfileImageUrl = '';
  userType = UserType.OtherUserProfile;
  isEnableEditProfile = false;
  socialProfileObj: any;
  singleFieldEdit = {
    displayName: false,
    location: false,
    email: false,
    phoneNo: false,
    socialProfile: false,
    name: false
  };

  activeEditField = '';
  loggedInUser: User;
  gamePlayedAgainst: any;
  applicationSettings: any;
  // tslint:disable-next-line:quotemark
  linkValidation =
    "^http(s?)://[0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*(:(0-9)*)*(/?)([a-zA-Z0-9-.?,'/\\+&amp;%$#_]*)?$";
  // tslint:disable-next-line:max-line-length
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  phoneNoRegex = /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x#]{1}(\d+))?\s*$/;
  userInvitations: { [key: string]: Invitation };
  loggedInUserAccount: Account;
  authProviderConstants: any;
  currentAuthProvider: string;

  constructor(
    public formBuilder: FormBuilder,
    public store: Store<AppState>,
    public userAction: UserActions,
    public utils: Utils,
    public cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    public authenticationProvider: AuthenticationProvider,
    @Inject(PLATFORM_ID) public platformId: Object
  ) {

    // remove single field edit for mobile
    if (!(
      isPlatformBrowser(this.platformId) === false &&
      isPlatformServer(this.platformId) === false
    )) {
      delete this.singleFieldEdit.email;
      delete this.singleFieldEdit.phoneNo;
      delete this.singleFieldEdit.socialProfile;
      delete this.singleFieldEdit.name;
    }

    this.toggleLoader(true);
    this.fb = formBuilder;
    this.tagsObs = this.store.select(getTags);
    this.authProviderConstants = AuthProviderConstants;

    this.subscriptions.push(
      this.tagsObs.subscribe(
        tagsAutoComplete => (this.tagsAutoComplete = tagsAutoComplete)
      )
    );

    this.subscriptions.push(
      this.route.params
        .pipe(
          skipWhile(params => !params.userid),
          map(params => (this.userId = params.userid)),
          flatMap(() =>
            this.store.select(appState.coreState).pipe(
              select(s => s.user),
              filter(u => u !== null)
            )
          ),
          switchMap(user => {
            if (user && user.userId === this.userId) {
              this.user = user;
              this.cd.markForCheck();
              this.setUserAuthProvider(user);

              this.userType = UserType.userProfile;
              return this.initializeUserProfile();
            } else {
              this.userType = UserType.loggedInOtherUserProfile;
              this.loggedInUser = user ? user : null;
              return this.initializeOtherUserProfile();
            }
          })
        )
        .subscribe()
    );
  }

  setUserAuthProvider(user) {
    if (
      user.authState &&
      user.authState.providerData &&
      user.authState.providerData.length > 0
    ) {
      this.currentAuthProvider =
        user.authState.providerData[0].providerId;
    } else if (user.authState && user.authState['providers']) {
      if (user.authState['providers'].length > 1) {
        this.currentAuthProvider =
          user.authState['providers'][1]['id'];
      } else if (user.authState['providers'].length === 1) {
        this.currentAuthProvider =
          user.authState['providers'][0]['id'];
      }
    } else {
      this.currentAuthProvider = '';
    }
  }

  initializeSocialSetting() {
    return this.store.select(appState.coreState).pipe(
      select(s => s.applicationSettings),
      map(appSettings => {
        if (appSettings[0]) {
          this.applicationSettings = { ...appSettings[0] };
          this.socialProfileObj = [...appSettings[0].social_profile];

          this.socialProfileSettings = appSettings[0].social_profile.filter(
            profile =>
              this.user &&
              this.user[profile.social_name] &&
              this.user[profile.social_name] !== ''
          );
          this.enableSocialProfile = this.socialProfileSettings.filter(
            profile => profile.enable
          ).length;
        }
      })
    );
  }

  showAllSocialSetting() {
    this.socialProfileSettings = [...this.socialProfileObj];
    this.socialProfileSettings.map(res => {
      return (res.disable = false);
    });
    this.enableSocialProfile = this.socialProfileSettings.filter(
      profile => profile.enable
    ).length;
  }

  getIcon(icon) {
    return String.fromCharCode(parseInt(`0x${icon}`, 16));
  }

  initializeUserProfile() {
    return combineLatest([
      this.store.select(appState.coreState).pipe(select(s => s.account)),
      this.store.select(getCategories),
      this.store.select(categoryDictionary),
      this.store.select(getTopTopics),
      this.initializeSocialSetting()
    ]).pipe(
      map(values => {
        this.account = values[0] || new Account();
        this.categories = values[1] || [];
        this.categoryDict = values[2] || {};
        this.topics = values[3] || [];
        this.userCopyForReset = { ...this.user };
        this.createForm(this.user);
        this.onValueChanges();

        if (this.user.profilePictureUrl) {
          this.profileImage.image = this.user.profilePictureUrl;
        }

        switch (this.user.bulkUploadPermissionStatus) {
          case this.NONE: {
            this.bulkUploadBtnText =
              profileSettingsConstants.BULK_UPLOAD_REQUEST_BTN_TEXT;
            break;
          }
          case this.PENDING: {
            this.bulkUploadBtnText =
              profileSettingsConstants.BULK_UPLOAD_SEND_REQUEST_AGAIN_BTN_TEXT;
            break;
          }
          default: {
            this.bulkUploadBtnText =
              profileSettingsConstants.BULK_UPLOAD_REQUEST_BTN_TEXT;
            break;
          }
        }
        if (this.user.roles && this.user.roles['bulkuploader']) {
          this.user.bulkUploadPermissionStatus =
            profileSettingsConstants.APPROVED;
        }
        this.toggleLoader(false);
        this.cd.markForCheck();
      })
    );
  }

  initializeOtherUserProfile() {
    this.store.dispatch(this.userAction.loadOtherUserExtendedInfo(this.userId));
    return this.store.select(appState.coreState).pipe(
      select(s => s.userDict),
      skipWhile(
        userDict =>
          !userDict || !userDict[this.userId] || !userDict[this.userId].account
      ),
      take(1),
      map(userDict => {
        this.user = userDict[this.userId];
        this.createForm(this.user);
        this.account = this.user.account;
        this.gamePlayedAgainst = this.user.gamePlayed;
        if (
          this.gamePlayedAgainst &&
          this.loggedInUser &&
          this.loggedInUser.userId &&
          this.userType === 1
        ) {
          this.gamePlayedChangeSubject.next(true);
        }
        this.userProfileImageUrl = this.getImageUrl(this.user);
        this.profileImage.image = this.userProfileImageUrl;
        this.toggleLoader(false);
      }),
      flatMap(() =>
        this.store.select(appState.coreState).pipe(
          select(s => s.userFriendInvitations),
          skipWhile(userInvitations => !userInvitations),
          map(userInvitations => {
            this.userInvitations = userInvitations;
            if (
              this.user &&
              this.user.email &&
              !this.userInvitations[this.user.email] &&
              this.loggedInUser
            ) {
              this.store.dispatch(
                this.userAction.loadUserInvitationsInfo(
                  this.loggedInUser.userId,
                  this.user.email,
                  this.user.userId
                )
              );
            }
          })
        )
      ),
      flatMap(() => this.initializeSocialSetting()),
      map(() => this.cd.markForCheck()),
      flatMap(() =>
        this.store.select(appState.coreState).pipe(
          select(s => s.account),
          skipWhile(account => !account || this.loggedInUserAccount === account)
        )
      ),
      map(s => {
        return (this.loggedInUserAccount = s);
      })
    );
  }

  get tagsArray(): FormArray {
    return this.userForm.get('tagsArray') as FormArray;
  }

  get categoryList(): FormArray {
    return this.userForm.get('categoryList') as FormArray;
  }

  get topicList(): FormArray {
    return this.userForm.get('topicList') as FormArray;
  }

  get socialAccountList(): FormArray {
    return this.userForm.get('socialAccountList') as FormArray;
  }

  ValidateUrl(control: AbstractControl) {
    if (
      control.value.toLowerCase().includes('http') ||
      control.value.toLowerCase().includes('www')
    ) {
      return { validUrl: true };
    }
    return null;
  }

  filter(val: string): string[] {
    return this.tagsAutoComplete.filter(option =>
      new RegExp(this.utils.regExpEscape(`${val}`), 'gi').test(option)
    );
  }

  toggleLoader(flag: boolean) {
    this.loaderBusy = flag;
  }

  // create the form based on user object
  createForm(user: User) {
    let tagsFA, categoryFA, topicsFA;
    if (this.userType === 0) {
      const categoryIds: FormGroup[] = this.categories.map(category => {
        const status =
          user.categoryIds && user.categoryIds.indexOf(category.id) !== -1
            ? true
            : false;
        const fg = new FormGroup({
          category: new FormControl(category.id),
          isSelected: new FormControl(status)
        });
        return fg;
      });

      const filteredTags = this.user.tags ? [...this.user.tags] : [];
      this.topics.forEach(data => {
        if (filteredTags.indexOf(data.id) >= 0) {
          filteredTags.splice(filteredTags.indexOf(data.id), 1);
        }
      });
      const topicsList = [...this.topics, ...filteredTags.map(data => {
        const newid = { id: data, type: 'tag' }; return newid;
      })];
      const topics: FormGroup[] = topicsList.map(topic => {
        const status =
          topic.type === 'category' ?
            (user.categoryIds && user.categoryIds.indexOf(topic.id) !== -1
              ? true
              : false) :
            (user.tags && user.tags.indexOf(topic.id) !== -1
              ? true
              : false);
        const fg = new FormGroup({
          topic: new FormControl(topic.id),
          isSelected: new FormControl(status),
          type: new FormControl(topic.type)
        });
        return fg;
      });

      this.userCategories = this.categories.map(category => {
        category.isSelected =
          user.categoryIds && user.categoryIds.indexOf(category.id) !== -1
            ? true
            : false;
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
      topicsFA = new FormArray(topics);


      this.enteredTags = user.tags;
    }
    this.userForm = this.fb.group(
      {
        name: [user.name, Validators.required],
        displayName: [user.displayName],
        location: [user.location],
        categoryList: categoryFA ? categoryFA : [],
        topicList: topicsFA ? topicsFA : [],
        tags: '',
        tagsArray: tagsFA ? tagsFA : [],
        profilePicture: [user.profilePicture],
        email: [user.email],
        phoneNo: [user.phoneNo],
        oldPassword: [''],
        password: [''],
        confirmPassword: ['']
      },
      { validator: profileUpdateFormValidator }
    );
    switch (this.currentAuthProvider) {
      case AuthProviderConstants.PASSWORD:
        this.userForm
          .get('email')
          .setValidators(Validators.pattern(this.emailRegex));
        this.userForm
          .get('phoneNo')
          .setValidators(Validators.pattern(this.phoneNoRegex));
        this.userForm.get('oldPassword').setValidators(Validators.minLength(6));
        this.userForm.get('password').setValidators(Validators.minLength(6));
        this.userForm
          .get('confirmPassword')
          .setValidators(Validators.minLength(6));
        this.userForm.get('email').updateValueAndValidity();
        this.userForm.get('phoneNo').updateValueAndValidity();
        this.userForm.get('password').updateValueAndValidity();
        this.userForm.get('oldPassword').updateValueAndValidity();
        this.userForm.get('confirmPassword').updateValueAndValidity();
        break;
      case AuthProviderConstants.GOOGLE:
        this.userForm
          .get('phoneNo')
          .setValidators(Validators.pattern(this.phoneNoRegex));
        this.userForm.get('phoneNo').updateValueAndValidity();
        break;
      case AuthProviderConstants.FACEBOOK:
        this.userForm
          .get('phoneNo')
          .setValidators(Validators.pattern(this.phoneNoRegex));
        this.userForm.get('phoneNo').updateValueAndValidity();
        break;
      case AuthProviderConstants.APPLE:
        this.userForm
          .get('phoneNo')
          .setValidators(Validators.pattern(this.phoneNoRegex));
        this.userForm.get('phoneNo').updateValueAndValidity();
        break;

      case AuthProviderConstants.PHONE:
        this.userForm
          .get('email')
          .setValidators(Validators.pattern(this.emailRegex));
        this.userForm.get('email').updateValueAndValidity();
        break;
    }
    this.filteredTags$ = this.userForm.get('tags').valueChanges
      .pipe(map(val => val.length > 0 ? this.filter(val) : []));
    this.createSocialProfileControl();
    if (
      isPlatformBrowser(this.platformId) === false &&
      isPlatformServer(this.platformId) === false
    ) {
      this.isEnableEditProfile = true;
      this.showAllSocialSetting();
    }
    if (!this.isEnableEditProfile) {
      this.disableForm(true);
    }
  }


  createSocialProfileControl() {
    if (this.socialProfileObj) {
      this.socialProfileObj.map(profile => {
        if (profile.enable) {
          const socialName = this.user[profile.social_name]
            ? this.user[profile.social_name]
            : '';
          this.userForm.addControl(
            profile.social_name,
            new FormControl(socialName, this.ValidateUrl)
          );
        }
      });
      this.socialProfileObj.sort((a, b) => a.position - b.position);
    }
  }

  getUserFromFormValue(isEditSingleField, field): void {
    if (field === 'socialProfile') {
      this.socialProfileObj.map(profile => {
        if (profile.enable) {
          this.user[profile.social_name] = this.userForm.get(
            profile.social_name
          ).value;
        }
      });
    }

    if (isEditSingleField) {
      if (this.userForm.get(field)) {
        this.user[field] = this.userForm.get(field).value;
        this.cd.markForCheck();
      }
    } else {
      this.user.name = this.userForm.get('name').value;
      this.user.categoryIds = [];
      this.user.tags = [];
      for (const obj of this.userForm.get('topicList').value) {
        if (obj['isSelected']) {
          obj['type'] === 'category' ? this.user.categoryIds.push(obj['topic']) : this.user.tags.push(obj['topic']);
        }
      }
      this.socialProfileObj.map(profile => {
        if (profile.enable) {
          this.user[profile.social_name] = this.userForm.get(
            profile.social_name
          ).value;
        }
      });
      // this.user.tags = [...this.enteredTags];
      this.user.profilePicture = this.userForm.get('profilePicture').value
        ? this.userForm.get('profilePicture').value
        : '';

      switch (this.currentAuthProvider) {
        case AuthProviderConstants.PASSWORD:
          this.user.email = this.userForm.get('email').value;
          this.user.phoneNo = this.userForm.get('phoneNo').value;
          break;
        case AuthProviderConstants.GOOGLE:
          this.user.phoneNo = this.userForm.get('phoneNo').value;
          break;
        case AuthProviderConstants.FACEBOOK:
          this.user.phoneNo = this.userForm.get('phoneNo').value;
          break;
        case AuthProviderConstants.APPLE:
          this.user.phoneNo = this.userForm.get('phoneNo').value;
          break;
        case AuthProviderConstants.PHONE:
          this.user.email = this.userForm.get('email').value;
          break;
      }
    }
  }

  resetUserProfile() {
    this.user = this.userCopyForReset; // cloneDeep(this.userCopyForReset);
    this.createForm(this.user);
  }

  // store the user object
  async saveUser(user: User, isLocationChanged: boolean) {
    if (this.currentAuthProvider === AuthProviderConstants.PASSWORD) {
      const currentPassword = this.userForm.get('oldPassword').value;
      const newPassword = this.userForm.get('password').value;
      if (
        currentPassword &&
        currentPassword !== null &&
        currentPassword.length > 0 &&
        newPassword &&
        newPassword !== null &&
        newPassword.length > 0
      ) {
        try {
          await this.authenticationProvider.updatePassword(
            this.user.email,
            currentPassword,
            newPassword
          );
        } catch (error) {
          console.log('error--->', error);
          throw error;
        }
      }
    }

    this.saveUserInformation(user, isLocationChanged);
  }

  saveUserInformation(user: User, isLocationChanged: boolean) {
    this.toggleLoader(true);
    this.isEnableEditProfile = false;
    this.disableForm();
    this.store.dispatch(
      this.userAction.addUserProfile(user, isLocationChanged)
    );
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
    this.activeEditField = field;
    this.singleFieldEdit[field] = this.singleFieldEdit[field] ? false : true;
    if (field !== 'socialProfile' && field !== 'email' && field !== 'phoneNo') {
      if (this.singleFieldEdit[field]) {
        this.userForm.get(field).enable();
        this.userForm.get(field).setValidators([Validators.required]);
        this.userForm.updateValueAndValidity();
      } else {
        this.userForm.get(field).disable();
        this.userForm.get(field).setValidators([]);
        this.userForm.updateValueAndValidity();
      }
    } else if (field === 'socialProfile') {
      this.socialProfileSettings = this.socialProfileSettings.map(res => {
        res.disable = true;
        return res;
      });
      this.cd.markForCheck();
      this.cd.detectChanges();
    } else if (field === 'email') {
      this.userForm
        .get('email')
        .setValidators([Validators.required, Validators.email]);
      this.userForm.updateValueAndValidity();
    } else if (field === 'phoneNo') {
      this.userForm
        .get('phoneNo')
        .setValidators([
          Validators.required,
          Validators.pattern(this.phoneNoRegex)
        ]);
      this.userForm.updateValueAndValidity({
        emitEvent: false,
        onlySelf: true
      });
    }
    this.cd.markForCheck();
  }

  setValidation(field: string) {
    for (const property in this.singleFieldEdit) {
      if (property !== 'socialProfile') {
        this.userForm.get(property).clearValidators();
        this.userForm.get(property).updateValueAndValidity();
      }
    }
    if (field !== 'socialProfile' && field !== 'email' && field !== 'phoneNo') {
      if (this.singleFieldEdit[field]) {
        this.userForm.get(field).enable();
        this.userForm.controls[field].setValidators([Validators.required]);
        this.userForm.controls[field].updateValueAndValidity();
      } else {
        this.userForm.get(field).disable();
        this.userForm.get(field).clearValidators();
        this.userForm.get(field).updateValueAndValidity();
      }
    } else if (field === 'socialProfile') {
      this.socialProfileSettings.map(res => {
        return (res.disable = true);
      });
      this.cd.markForCheck();
    } else if (field === 'email') {
      this.userForm.controls['email'].setValidators([
        Validators.required,
        Validators.email
      ]);
      this.userForm.controls['email'].updateValueAndValidity();
    } else if (field === 'phoneNo') {
      this.userForm.controls['phoneNo'].setValidators([
        Validators.required,
        Validators.pattern(this.phoneNoRegex)
      ]);
      this.userForm.get('phoneNo').markAsTouched();
      this.userForm.controls['phoneNo'].updateValueAndValidity();
    }
  }

  sendFriendRequest() {
    const inviteeUserId = this.user.userId;
    this.store.dispatch(
      this.userAction.addUserInvitation({
        userId: this.loggedInUser.userId,
        inviteeUserId: inviteeUserId
      })
    );
  }
  checkDisplayName(displayName: string) {
    this.store.dispatch(this.userAction.checkDisplayName(displayName));
  }

  getCityAndCountryName(location) {
    let userLocation: string[] = [];
    if (location.results) {
      location.results[0].address_components.map(component => {
        const cityList = component.types.filter(
          typeName => { return typeName === 'administrative_area_level_3' }
        );
        if (cityList.length > 0) {
          userLocation.push(component.long_name);
        } else {
          const cityList1 = component.types.filter(
            typeName => { return typeName === 'administrative_area_level_2'; }
          );
          if (cityList1.length > 0) {
            userLocation.push(component.long_name);
          }
        }
        const stateList = component.types.filter(
          typeName => { return typeName === 'administrative_area_level_1'; }
        );
        if (stateList.length > 0) {
          userLocation.push(component.long_name);
        }
      });

      // If userLocation length is 3 means we have admin_area_level_3 is exist  so we remove administrative_area_level_2
      // from index 1 because we store it in index 1
      if (userLocation.length === 3) {
        userLocation.splice(1, 1);
      }


      return userLocation.toString();
    } else {
      return '';
    }
  }

  startNewGame() {
    this.router.navigate(['/game-play/challenge/', this.user.userId]);
  }

  get isLivesEnable(): Boolean {
    const isEnable =
      (this.loggedInUser &&
        this.loggedInUserAccount &&
        this.loggedInUserAccount.lives > 0 &&
        this.applicationSettings.lives.enable) ||
        !this.applicationSettings.lives.enable
        ? true
        : false;
    return isEnable;
  }

  onValueChanges(): void {
    this.subscriptions.push(
      this.userForm.valueChanges.subscribe(val => {
        this.cd.detectChanges();
        this.cd.markForCheck();
      })
    );
  }

  changedLocation(event): void {
    this.user.isAutoComplete = true;
  }

}

function profileUpdateFormValidator(fg: FormGroup): { [key: string]: boolean } {
  // Password match validation for password update only
  if (
    fg.get('password') &&
    fg.get('confirmPassword') &&
    fg.get('password').value &&
    fg.get('confirmPassword').value
  ) {
    if (fg.get('password').value !== fg.get('confirmPassword').value) {
      return { passwordmismatch: true };
    }

    if (!fg.get('oldPassword') || !fg.get('oldPassword').value) {
      return { requiredoldpassword: true };
    }

    return null;
  }

  return null;
}
