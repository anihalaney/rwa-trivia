import {
  Component, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { ProfileSettings } from './profile-settings';
import { Utils } from 'shared-library/core/services';
import { profileSettingsConstants } from 'shared-library/shared/model';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { TokenModel } from 'nativescript-ui-autocomplete';
import { RadAutoCompleteTextViewComponent } from 'nativescript-ui-autocomplete/angular';
import { ImageAsset } from 'tns-core-modules/image-asset';
import { ImageSource } from 'tns-core-modules/image-source';
import * as Toast from 'nativescript-toast';
import { coreState, UserActions } from 'shared-library/core/store';
import { isAndroid } from 'tns-core-modules/platform';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as imageAssetModule from 'tns-core-modules/image-asset/image-asset';
import { Mediafilepicker, ImagePickerOptions } from 'nativescript-mediafilepicker';
import * as app from 'tns-core-modules/application';

@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
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
  @ViewChildren('textField') textField: QueryList<ElementRef>;
  subscriptions = [];

  public imageTaken: ImageAsset;
  public saveToGallery = true;
  public keepAspectRatio = true;
  public width = 300;
  public height = 300;


  @ViewChild('autocomplete') autocomplete: RadAutoCompleteTextViewComponent;


  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public userAction: UserActions,
    public utils: Utils,
    public cd: ChangeDetectorRef) {
    super(fb, store, userAction, utils, cd);
    this.initDataItems();

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'SUCCESS') {
        Toast.makeText('Profile is saved successfully').show();
        this.toggleLoader(false);
      }
      this.cd.markForCheck();
    }));
  }

  get dataItems(): ObservableArray<TokenModel> {
    return this.tagItems;
  }

  onTakePhoto() {
    const options: ImagePickerOptions = {
      android: {
        isCaptureMood: false, // if true then camera will open directly.
        isNeedCamera: true,
        maxNumberFiles: 1,
        isNeedFolderList: true
      }, ios: {
        isCaptureMood: false, // if true then camera will open directly.
        maxNumberFiles: 1
      }
    };

    const mediafilepicker = new Mediafilepicker();
    mediafilepicker.openImagePicker(options);

    mediafilepicker.on('getFiles', (res) => {
      const results = res.object.get('results');

      if (results) {

        const result = results[0];

        if (result.file && app.ios && !options.ios.isCaptureMood) {

          // or can get UIImage to display
          mediafilepicker.convertPHImageToUIImage(result.rawData).then(res1 => {
            console.log('test1 ---> ', res1);
          });
        } else if (result.file && app.ios) {
          // So we have taken image & will get UIImage

          // We can copy it to app directory, if need
          const fileName = 'myTmpImage.jpg';
          mediafilepicker.copyUIImageToAppDirectory(result.rawData, fileName).then((res1: any) => {
            console.dir('test2 ---> ', res1);
          }).catch(e => {
            console.dir(e);
          });
        } else {
          const asset = new imageAssetModule.ImageAsset(result.file);
          if (app.android) {
            const source = new ImageSource();
            source.fromAsset(asset).then(imageSource => {
              this.profileImage.image = `data:image/jpeg;base64,${imageSource.toBase64String('jpeg', 100)}`;
              this.saveProfileImage();
            });
          } else if (app.ios) {
            console.log(asset.ios);
          }
        }
      }
    });

    mediafilepicker.on('error', (res) => {
      const msg = res.object.get('msg');
      console.log(msg);
    });

    mediafilepicker.on('cancel', (res) => {
      const msg = res.object.get('msg');
      console.log(msg);
    });
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
    this.hideKeyboard();
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
      Toast.makeText('Please add name, display name, location and profile picture for bulk upload request').show();
    } else {
      this.user.bulkUploadPermissionStatus = profileSettingsConstants.NONE;
      this.onSubmit();
    }

  }

  onSubmit() {
    // validations
    this.userForm.updateValueAndValidity();

    if (this.profileImageFile) {
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

  hideKeyboard() {
    this.textField
      .toArray()
      .map((el) => {
        if (isAndroid) {
          el.nativeElement.android.clearFocus();
        }
        return el.nativeElement.dismissSoftInput();
      });
  }

  ngOnDestroy() {
  }

}
