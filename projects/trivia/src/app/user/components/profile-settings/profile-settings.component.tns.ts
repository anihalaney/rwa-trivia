import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { userState } from '../../../user/store';
import { ProfileSettings } from './profile-settings';
import { Utils } from 'shared-library/core/services';
import { profileSettingsConstants } from 'shared-library/shared/model';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { ImageAsset } from 'tns-core-modules/image-asset';
import { ImageSource } from 'tns-core-modules/image-source';
import { takePicture, requestPermissions, isAvailable } from 'nativescript-camera';
import * as Toast from 'nativescript-toast';
import { coreState, UserActions } from 'shared-library/core/store';
import { Page, EventData } from 'tns-core-modules/ui/page/page';


@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})

export class ProfileSettingsComponent extends ProfileSettings implements OnDestroy {

  // Properties
  showSelectCategory = false;
  showSelectTag = false;
  dataItem;
  customTag: string;
  private tagItems: ObservableArray<TokenModel>;
  private facebookUrlStatus = true;
  private twitterUrlStatus = true;
  private linkedInUrlStatus = true;
  SOCIAL_LABEL = 'CONNECT YOUR SOCIAL ACCOUNT';

  public imageTaken: ImageAsset;
  public saveToGallery = true;
  public keepAspectRatio = true;
  public width = 300;
  public height = 300;


  @ViewChild('autocomplete') autocomplete: RadAutoCompleteTextViewComponent;


  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public userAction: UserActions,
    private page: Page,
    public utils: Utils) {

    super(fb, store, userAction, utils);
    this.initDataItems();

    this.subs.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'SUCCESS') {
        Toast.makeText('Profile is saved successfully').show();
        this.toggleLoader(false);
      }
    }));

  }

  get dataItems(): ObservableArray<TokenModel> {
    return this.tagItems;
  }

  onTakePhoto() {
    const options = {
      keepAspectRatio: this.keepAspectRatio,
      saveToGallery: this.saveToGallery
    };

    if (isAvailable()) {
      requestPermissions();
      takePicture(options)
        .then(imageAsset => {
          this.imageTaken = imageAsset;
          const source = new ImageSource();
          source.fromAsset(imageAsset).then(imageSource => {
            this.profileImage.image = `data:image/jpeg;base64,${imageSource.toBase64String('jpeg', 100)}`;
            this.saveProfileImage();
          });
        }).catch(err => {
          console.log(err.message);
        });
    }

  }

  saveProfileImage() {
    this.getUserFromFormValue(this.userForm.value);
    this.assignImageValues();
    this.saveUser(this.user);
  }

  assignImageValues(): void {
    const fileName = `${new Date().getTime()}.jpg`;
    this.user.profilePicture = fileName;
    this.user.originalImageUrl = this.profileImage.image;
    this.user.croppedImageUrl = this.profileImage.image;
    this.user.imageType = 'image/jpeg';
    this.userForm.get('profilePicture').setValue(fileName);
    this.userForm.updateValueAndValidity();
  }


  addCustomTag() {
    this.enteredTags.push(this.customTag);
    this.customTag = '';
    this.autocomplete.autoCompleteTextView.resetAutocomplete();
  }

  selectCategory(category) {
    category.isSelected = (!category.isSelected) ? true : false;
  }

  private initDataItems() {
    this.tagItems = new ObservableArray<TokenModel>();

    for (let i = 0; i < this.tagsAutoComplete.length; i++) {
      this.tagItems.push(new TokenModel(this.tagsAutoComplete[i], undefined));
    }
  }

  public onDidAutoComplete(args) {
    this.customTag = args.text;
  }

  public onTextChanged(args) {
    this.customTag = args.text;
  }

  removeEnteredTag(tag) {
    this.enteredTags = this.enteredTags.filter(t => t !== tag);
  }


  setBulkUploadRequest(checkStatus: boolean): void {
    const userForm = this.userForm.value;
    if (!userForm.name || !userForm.displayName || !userForm.location || !userForm.profilePicture) {
      Toast.makeText('Please complete profile settings for bulk upload request').show();
    } else {
      this.user.bulkUploadPermissionStatus = profileSettingsConstants.NONE;
      this.onSubmit();
    }

  }

  onSubmit() {
    // validations
    this.userForm.updateValueAndValidity();

    if (!this.profileImageFile && !this.user.profilePicture) {
      Toast.makeText('Please upload the profile picture').show();
      return;
    } else if (this.profileImageFile) {
      this.assignImageValues();
    }


    if (this.userForm.invalid) {
      Toast.makeText('Please fill the mandatory fields').show();
      return;
    }

    // get user object from the forms
    this.getUserFromFormValue(this.userForm.value);
    this.user.categoryIds = this.userCategories.filter(c => c.isSelected).map(c => c.id);
    // call saveUser
    this.saveUser(this.user);

  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

}
