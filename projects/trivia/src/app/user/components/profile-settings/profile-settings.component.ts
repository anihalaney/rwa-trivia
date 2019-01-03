import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { userState } from '../../../user/store';
import { ProfileSettings } from './profile-settings';
import { Utils, WindowRef } from 'shared-library/core/services';
import { profileSettingsConstants } from 'shared-library/shared/model';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { coreState, UserActions } from 'shared-library/core/store';


@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})

export class ProfileSettingsComponent extends ProfileSettings implements OnDestroy {

  @ViewChild('cropper') cropper: ImageCropperComponent;
  // Properties
  cropperSettings: CropperSettings;
  notificationMsg: string;
  errorStatus: boolean;

  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    private windowRef: WindowRef,
    public userAction: UserActions,
    public utils: Utils) {

    super(fb, store, userAction, utils);

    this.setCropperSettings();
    this.setNotificationMsg('', false, 0);

    this.subs.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'SUCCESS') {
        this.setNotificationMsg('Profile Saved !', false, 100);
      }
    }));
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

  setBulkUploadRequest(checkStatus: boolean): void {
    const userForm = this.userForm.value;
    if (!userForm.name || !userForm.displayName || !userForm.location || !userForm.profilePicture) {
      this.setNotificationMsg('Please complete profile settings for bulk upload request', true, 100);
    } else {
      this.user.bulkUploadPermissionStatus = profileSettingsConstants.NONE;
      this.onSubmit();
    }

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

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

}
