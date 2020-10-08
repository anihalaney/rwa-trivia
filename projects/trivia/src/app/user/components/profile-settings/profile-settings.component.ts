import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { Subscription, Subject } from 'rxjs';
import { Utils, WindowRef } from 'shared-library/core/services';
import { coreState, UserActions } from 'shared-library/core/store';
import { FirebaseAnalyticsKeyConstants, FirebaseAnalyticsEventConstants } from 'shared-library/shared/model';
import { AppState } from '../../../store';
import { ProfileSettings } from './profile-settings';
import { MatDialogRef, MatDialog } from '@angular/material';
import { LocationResetDialogComponent } from './location-reset-dialog/location-reset-dialog.component';
import { filter } from 'rxjs/operators';
import { AuthenticationProvider } from 'shared-library/core/auth';
import { isPlatformBrowser } from '@angular/common';
import * as firebase from 'firebase/app';

@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class ProfileSettingsComponent extends ProfileSettings implements OnInit, OnDestroy {

  dialogRef: MatDialogRef<LocationResetDialogComponent>;

  @ViewChild('cropper', { static: false }) cropper: ImageCropperComponent;
  // Properties
  cropperSettings: CropperSettings;
  notificationMsg: string;
  errorStatus: boolean;
  checkUserSubscriptions: Subscription;
  isValidDisplayName: boolean = null;
  locationTerm$ = new Subject<string>();
  locations = [];

  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    private windowRef: WindowRef,
    @Inject(PLATFORM_ID) public platformId: Object,
    public userAction: UserActions,
    public cd: ChangeDetectorRef,
    public utils: Utils,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public authenticationProvider: AuthenticationProvider,
  ) {

    super(fb, store, userAction, utils, cd, route, router, authenticationProvider, platformId);
    // if (this.userType === 0) {
    this.setCropperSettings();
    this.setNotificationMsg('', false, 0);

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'SUCCESS') {
        this.setNotificationMsg('Profile Saved !', false, 100);
        this.cd.markForCheck();
      }
    }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.userProfileSaveStatus)).subscribe((status: string) => {
      if (status && status !== 'NONE' && status !== 'IN PROCESS' && status !== 'SUCCESS' && status !== 'MAKE FRIEND SUCCESS') {
        this.setNotificationMsg(status, false, 100);
        this.cd.markForCheck();
      }
      this.cd.markForCheck();
    }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(u => u.addressUsingLongLat), filter(location => !!location))
      .subscribe(location => {
        if (location) {
          this.user.captured = 'web';
          this.user.isAutoComplete = false;
          this.userForm.patchValue({ location: this.getCityAndCountryName(location) });
        }
      }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(u => u.addressSuggestions), filter(location => !!location))
      .subscribe(locations => {
        this.locations = [];
        locations.predictions.map(location => {
          const city = location.terms[0].value;
          const country = location.terms[(location.terms.length - 1)].value;
          this.locations.push(`${city}, ${country}`);
        });
        this.cd.markForCheck();
      }));

  }

  setNotificationMsg(msg: string, flag: boolean, scrollPosition: number): void {
    this.notificationMsg = msg;
    this.errorStatus = flag;
    if (isPlatformBrowser(this.platformId) && this.windowRef.nativeWindow.scrollTo) {
      this.windowRef.nativeWindow.scrollTo(0, scrollPosition);
    }
  }

  ngOnInit(): void {
  }

  locationChanged(result): void {
    if (result) {
      this.store.dispatch(this.userAction.loadAddressSuggestions(result));
      this.user.captured = 'web';
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
      this.enableForm();
      this.getUserFromFormValue(false, '');
      this.disableForm();
      this.assignImageValues();
      this.saveUser(this.user, (this.user.location !== this.userCopyForReset.location) ? true : false);
      this.cd.markForCheck();
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

  // Unit test issue - Cannot read property 'unsubscribe' of undefined (Line - 239 this.checkUserSubscriptions.unsubscribe())
  onSubmit(isEditSingleField = false, field = '') {
    // validations
    this.userForm.updateValueAndValidity();

    if (this.profileImageFile) {
      this.assignImageValues();
    }
    // validate for main form except single edit field
    if (this.userForm.invalid && !isEditSingleField) {

      const controls = this.userForm.controls;
      const singleEditFields = Object.getOwnPropertyNames(this.singleFieldEdit);
      for (const name in controls) {
        if (controls[name].invalid && singleEditFields.indexOf(name) < 0) {
          this.setNotificationMsg('Please fill the mandatory fields', true, 100);
          return;
        }
      }
    }

    this.checkDisplayName(this.userForm.get('displayName').value);


    this.checkUserSubscriptions = this.store.select(coreState).pipe(select(s => s.checkDisplayName)).subscribe(status => {

      this.isValidDisplayName = status;

      if (this.isValidDisplayName !== null) {
        if (this.isValidDisplayName) {
          // get user object from the forms
          this.getUserFromFormValue(isEditSingleField, field);
          if (isEditSingleField) {
            this.userForm.get(field).disable();
            this.singleFieldEdit[field] = false;
          }

          // call saveUser
          this.saveUser(this.user, (this.user.location !== this.userCopyForReset.location) ? true : false);
          this.setNotificationMsg('', false, 0);
          this.cd.markForCheck();
        } else {

          this.userForm.controls['displayName'].setErrors({ 'exist': true });
          this.userForm.controls['displayName'].markAsTouched();
          this.cd.markForCheck();
        }

        this.isValidDisplayName = null;
        // This needs to be checked for unit test
        // from unit test we refresh state which calls subscription in sync
        // when it is called in sync this.checkUserSubscriptions is not defined yet
        // normal execution , this does not happen as subscription callback function only called
        // when store has value;
        if (this.checkUserSubscriptions) {
        this.checkUserSubscriptions.unsubscribe();
        }
      }

    });

  }

  pushAnalyticsData() {
    if (isPlatformBrowser(this.platformId) && this.windowRef.isDataLayerAvailable()) {
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.USER_ID, this.user.userId);
      this.windowRef.addAnalyticsParameters(FirebaseAnalyticsKeyConstants.LOCATION, this.user.location);
      this.windowRef.pushAnalyticsEvents(FirebaseAnalyticsEventConstants.USER_LOCATION);
    }
  }

  ngOnDestroy() {

  }

  // Unit test issue - navigator.geolocation found undefinde all time that's why function is not execute.
  getLocation() {
    if (isPlatformBrowser(this.platformId) && this.windowRef.getNavigatorGeolocation()) {
      this.windowRef.getNavigatorGeolocation().getCurrentPosition((position) => {
        this.store.dispatch(this.userAction.loadAddressUsingLatLong(`${position.coords.latitude},${position.coords.longitude}`));
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.user.geoPoint = new firebase.firestore.GeoPoint(latitude, longitude);
      }, error => {
        console.log('error', error);
        this.dialogRef = this.dialog.open(LocationResetDialogComponent, {
          disableClose: false
        });
      });
    }
  }

}
