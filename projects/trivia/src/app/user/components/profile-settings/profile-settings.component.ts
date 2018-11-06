import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, take, finalize } from 'rxjs/operators';
import { User, Category, profileSettingsConstants } from 'shared-library/shared/model';
import { Utils, WindowRef } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary, getCategories, getTags } from '../../../store';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { AngularFireStorage } from '@angular/fire/storage';
import * as cloneDeep from 'lodash.clonedeep';
import * as userActions from '../../store/actions';
import { userState } from '../../../user/store';


@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnDestroy {
  @Input() user: User;
  @ViewChild('cropper') cropper: ImageCropperComponent;
  // Properties
  categories: Category[];
  categoryDict: { [key: number]: Category };
  categoryDictObs: Observable<{ [key: number]: Category }>;
  subs: Subscription[] = [];
  categoriesObs: Observable<Category[]>;
  userForm: FormGroup;
  profileOptions: string[] = ['Only with friends', 'With EveryOne'];
  locationOptions: string[] = ['Only with friends', 'With EveryOne'];

  userObs: Observable<User>;

  profileImage: { image: any } = { image: '/assets/images/avatarimg.jpg' };
  basePath = '/profile';
  profileImagePath = 'avatar';
  originalImagePath = 'original';
  profileImageValidation: String;
  profileImageFile: File;

  userCopyForReset: User;

  cropperSettings: CropperSettings;


  sub: Subscription;

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

  // tslint:disable-next-line:quotemark
  linkValidation = "^http(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$";

  notificationMsg: string;
  errorStatus: boolean;

  constructor(private fb: FormBuilder,
    private store: Store<AppState>,
    private storage: AngularFireStorage,
    private windowRef: WindowRef,
    private utils: Utils) {

    this.setNotificationMsg('', false, 0);

    this.subs.push(this.store.select(appState.coreState).pipe(take(1)).subscribe((s) => {
      this.user = s.user;
    }));
    this.categoriesObs = store.select(getCategories);
    this.subs.push(this.categoriesObs.subscribe(categories => this.categories = categories));
    this.categoryDictObs = store.select(categoryDictionary);
    this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
    this.tagsObs = this.store.select(getTags);
    this.subs.push(this.tagsObs.subscribe(tagsAutoComplete => this.tagsAutoComplete = tagsAutoComplete));
    this.setCropperSettings();

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
      }
    }));

    this.subs.push(this.store.select(userState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'SUCCESS') {
        this.setNotificationMsg('Profile Saved !', false, 100);
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

  setNotificationMsg(msg: string, flag: boolean, scrollPosition: number): void {
    this.notificationMsg = msg;
    this.errorStatus = flag;
    if (this.windowRef.nativeWindow.scrollTo) {
      this.windowRef.nativeWindow.scrollTo(0, scrollPosition);
    }
  }


  private setCropperSettings() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 150;
    this.cropperSettings.height = 140;
    this.cropperSettings.croppedWidth = 150;
    this.cropperSettings.croppedHeight = 140;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 280;
    this.cropperSettings.minWidth = 10;
    this.cropperSettings.minHeight = 10;
    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = false;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
  }

  filter(val: string): string[] {
    return this.tagsAutoComplete.filter(option => new RegExp(this.utils.regExpEscape(`${val}`), 'gi').test(option));
  }

  onFileChange($event) {
    this.validateImage($event.target.files);
    if (!this.profileImageValidation) {
      const image = new Image();
      this.profileImageFile = $event.target.files[0];
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(this.profileImageFile);
      reader.onloadend = (loadEvent: any) => {
        image.src = loadEvent.target.result;
        this.user.originalImageUrl = image.src;
        this.cropper.setImage(image);
      };
    }
  }

  validateImage(fileList: FileList) {
    if (fileList.length === 0) {
      this.profileImageValidation = 'Please select Profile picture';
    } else {
      const file: File = fileList[0];
      const fileName = file.name;
      const fileSize = file.size;
      const fileType = file.type;

      if (fileSize > 2097152) {
        this.profileImageValidation = 'Your uploaded Profile is not larger than 2 MB.';
      } else {
        if (fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png' || fileType === 'image/gif') {
          this.profileImageValidation = undefined;
        } else {
          this.profileImageValidation = 'Only PNG, GIF, JPG and JPEG Type Allow.';
        }
      }
    }
  }

  saveProfileImage() {
    if (!this.profileImageValidation) {
      this.getUserFromFormValue(this.userForm.value);
      this.assignImageValues();
      this.saveUser(this.user);
    }
  }

  assignImageValues(): void {
    const fileName = `${new Date().getTime()}-${this.profileImageFile.name}`;
    this.user.profilePicture = fileName;
    this.user.croppedImageUrl = this.profileImage.image;
    this.user.imageType = this.profileImageFile.type;
    this.profileImageFile = undefined;
    this.userForm.get('profilePicture').setValue(fileName);
    this.userForm.updateValueAndValidity();
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
      facebookUrl: [user.facebookUrl, Validators.pattern(this.linkValidation)],
      twitterUrl: [user.twitterUrl, Validators.pattern(this.linkValidation)],
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

  // tags start
  // Event Handlers
  addTag() {
    const tag = this.userForm.get('tags').value;
    if (tag) {
      if (this.enteredTags.indexOf(tag) < 0) {
        this.enteredTags.push(tag);
      }
      this.userForm.get('tags').setValue('');
    }
    this.setTagsArray();
  }

  removeEnteredTag(tag) {
    this.enteredTags = this.enteredTags.filter(t => t !== tag);
    this.setTagsArray();
  }

  setTagsArray() {
    this.tagsArray.controls = [];
    this.enteredTags.forEach(tag => this.tagsArray.push(new FormControl(tag)));
  }
  // tags end

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

  setBulkUploadRequest(checkStatus: boolean): void {
    const userForm = this.userForm.value;
    if (!userForm.name || !userForm.displayName || !userForm.location || !userForm.profilePicture) {
      this.setNotificationMsg('Please complete profile settings for bulk upload request', true, 100);
    } else {
      this.user.bulkUploadPermissionStatus = profileSettingsConstants.NONE;
      this.onSubmit();
    }

  }

  resetUserProfile() {
    this.user = cloneDeep(this.userCopyForReset);
    this.createForm(this.user);
    this.filteredTags$ = this.userForm.get('tags').valueChanges
      .pipe(map(val => val.length > 0 ? this.filter(val) : []));
  }

  onSubmit() {
    // validations
    this.userForm.updateValueAndValidity();

    if (!this.profileImageFile && !this.user.profilePicture) {
      this.setNotificationMsg('Please upload the profile picture', true, 100);
      return;
    } else if (this.profileImageFile) {
      this.assignImageValues();
    }


    if (this.userForm.invalid) {
      this.setNotificationMsg('Please fill the mandatory fields', true, 100);
      return;
    }

    // get user object from the forms
    this.getUserFromFormValue(this.userForm.value);
    // call saveUser
    this.saveUser(this.user);
    this.setNotificationMsg('', false, 0);
  }

  // store the user object
  saveUser(user: User) {
    this.store.dispatch(new userActions.AddUserProfile({ user: user }));
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

}
