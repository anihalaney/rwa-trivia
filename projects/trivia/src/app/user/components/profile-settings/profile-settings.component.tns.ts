import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  Component,
  OnInit,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import {
  isAvailable,
  requestPermissions,
  takePicture
} from "nativescript-camera";
import * as geolocation from "nativescript-geolocation";
import { ImageCropper } from "nativescript-imagecropper";
import * as imagepicker from "nativescript-imagepicker";
import { TokenModel } from "nativescript-ui-autocomplete";
import { RadAutoCompleteTextViewComponent } from "nativescript-ui-autocomplete/angular";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { filter } from "rxjs/operators";
import { Utils } from "shared-library/core/services";
import { coreState, UserActions } from "shared-library/core/store";
import { profileSettingsConstants } from "shared-library/shared/model";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { ImageAsset } from "tns-core-modules/image-asset";
import { fromAsset, ImageSource } from "tns-core-modules/image-source";
import { isIOS, isAndroid } from "tns-core-modules/platform";
import * as dialogs from "tns-core-modules/ui/dialogs";
import {
  SegmentedBar,
  SegmentedBarItem
} from "tns-core-modules/ui/segmented-bar";
import * as utils from "tns-core-modules/utils/utils";
import { AppState } from "../../../store";
import { userState } from "../../store";
import { LocationResetDialogComponent } from "./location-reset-dialog/location-reset-dialog.component";
import { ProfileSettings } from "./profile-settings";
import { AuthenticationProvider } from "shared-library/core/auth";
import * as Platform from "tns-core-modules/platform";
import { RouterExtensions } from "nativescript-angular/router";
import { screen } from "tns-core-modules/platform";
const firebase = require('nativescript-plugin-firebase/app');

declare var IQKeyboardManager;

@Component({
  selector: "profile-settings",
  templateUrl: "./profile-settings.component.html",
  styleUrls: ["./profile-settings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe({ arrayName: "subscriptions" })
export class ProfileSettingsComponent extends ProfileSettings
  implements OnDestroy, AfterViewInit, OnInit {
  // Properties
  showSelectCategory = false;
  showSelectTag = false;
  dataItem;
  customTag: string;
  private tagItems: ObservableArray<TokenModel>;
  SOCIAL_LABEL = "CONNECT YOUR SOCIAL ACCOUNT";
  @ViewChildren("textField", { read: false }) textField: QueryList<ElementRef>;
  platform = Platform;
  isValidDisplayName: boolean = null;
  isLocationEdit: boolean = false;
  public imageTaken: ImageAsset;
  public saveToGallery = true;
  public keepAspectRatio = true;
  public width = 200;
  public height = 200;
  disableSocialProfileSettings: boolean = false;
  public items: Array<SegmentedBarItem>;
  public selectedIndex = 0;
  tabsTitles: Array<string>;
  private locations: ObservableArray<TokenModel>;
  private isLocationEnalbed: boolean;
  iqKeyboard: any;
  isSavingUserName: boolean;

  @ViewChild("autocomplete", { static: false })
  autocomplete: RadAutoCompleteTextViewComponent;
  @ViewChild("acLocation", { static: false })
  acLocation: RadAutoCompleteTextViewComponent;
  @ViewChildren("socialField") socialField: QueryList<ElementRef>;
  constructor(
    public fb: FormBuilder,
    public store: Store<AppState>,
    public userAction: UserActions,
    public uUtils: Utils,
    public cd: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    private modal: ModalDialogService,
    private vcRef: ViewContainerRef,
    public authenticationProvider: AuthenticationProvider,
    private routerExtensions: RouterExtensions,
    @Inject(PLATFORM_ID) public platformId: Object
  ) {
    super(
      fb,
      store,
      userAction,
      uUtils,
      cd,
      route,
      router,
      authenticationProvider,
      platformId
    );


    this.initDataItems();
    requestPermissions();

    if (isIOS) {
      this.iqKeyboard = IQKeyboardManager.sharedManager();
      this.iqKeyboard.shouldResignOnTouchOutside = true;
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store
        .select(coreState)
        .pipe(select(s => s.userProfileSaveStatus))
        .subscribe(status => {
          if (status === "SUCCESS") {
            this.uUtils.showMessage("success", "Profile is saved successfully");
            this.toggleLoader(false);
          }
          this.isSavingUserName = false;
          this.cd.markForCheck();
        })
    );
    this.tabsTitles = ["Profile", "Stats"];
    this.items = [];
    for (let i = 0; i < this.tabsTitles.length; i++) {
      const segmentedBarItem = <SegmentedBarItem>new SegmentedBarItem();
      segmentedBarItem.title = this.tabsTitles[i];
      this.items.push(segmentedBarItem);
    }

    this.subscriptions.push(
      this.store
        .select(coreState)
        .pipe(select(s => s.userProfileSaveStatus))
        .subscribe((status: string) => {
          if (
            status &&
            status !== "NONE" &&
            status !== "IN PROCESS" &&
            status !== "SUCCESS" &&
            status !== "MAKE FRIEND SUCCESS"
          ) {
            this.utils.showMessage("success", status);
          }
          this.cd.markForCheck();
        })
    );

    this.subscriptions.push(
      this.gamePlayedChangeObservable.subscribe(data => {
        if (this.tabsTitles.indexOf("Game Played") < 0) {
          this.tabsTitles.push("Game Played");
          const segmentedBarItem = <SegmentedBarItem>new SegmentedBarItem();
          segmentedBarItem.title = "Game Played";
          this.items.push(segmentedBarItem);
        }
      })
    );

    this.subscriptions.push(
      this.store
        .select(coreState)
        .pipe(
          select(u => u.addressUsingLongLat),
          filter(location => !!location)
        )
        .subscribe(location => {
          if (location) {
            const cityAndCountry = this.getCityAndCountryName(location);
            this.userForm.patchValue({ location: cityAndCountry });
            this.acLocation.nativeElement.text = cityAndCountry;
            this.user.captured = 'mobile';
            this.user.isAutoComplete = false;
          }
        })
    );
  }

  ngAfterViewInit(): void {
    if (this.acLocation) {
      this.acLocation.autoCompleteTextView.loadSuggestionsAsync = async text => {
        return new Promise((resolve, reject) => {
          if (text.length > 3) {
            this.store.dispatch(this.userAction.loadAddressSuggestions(text));
            this.subscriptions.push(
              this.store
                .select(coreState)
                .pipe(
                  select(u => u.addressSuggestions),
                  filter(location => !!location)
                )
                .subscribe(locations => {
                  const items = [];
                  if (locations.predictions) {
                    locations.predictions.map(location => {
                      const city = location.terms[0].value;
                      const country =
                        location.terms[location.terms.length - 1].value;
                      items.push(new TokenModel(`${city}, ${country}`, null));
                    });
                  }
                  resolve(items);
                  this.cd.markForCheck();
                })
            );
          } else {
            resolve([]);
            this.cd.markForCheck();
          }
        });
      };
    }
  }

  onLoadedLocation(event) {
    if (this.userType === 1) {
      event.object.text = this.user.location;
      event.object.readOnly = true;
    } else {
      if (this.userForm.value.location) {
        this.acLocation.nativeElement.text = this.userForm.value.location;
        this.cd.markForCheck();
      }
    }
  }

  onTextChangedLocation(location): void {
    this.userForm.patchValue({ location: location.text });
    this.user.captured = 'mobile';
  }

  editLocationField() {
    this.singleFieldEdit["location"] = !this.singleFieldEdit["location"];
    this.cd.detectChanges();
  }

  onSelectedIndexChange(args) {
    const segmentedBar = <SegmentedBar>args.object;
    this.selectedIndex = segmentedBar.selectedIndex;
  }

  get dataLocation(): ObservableArray<TokenModel> {
    return this.locations;
  }

  get dataItems(): ObservableArray<TokenModel> {
    return this.tagItems;
  }

  onTakePhoto() {
    dialogs
      .action({
        message: "Choose option",
        cancelButtonText: "Cancel",
        actions: ["Camera", "Gallery"]
      })
      .then(result => {
        if (result === "Camera") {
          this.changeProfilePictureFromCamera();
        } else if (result === "Gallery") {
          this.changeProfilePictureFromGallery();
        }
      });
  }

  async changeProfilePictureFromCamera() {
    const options = {
      width: this.width,
      height: this.height,
      keepAspectRatio: this.keepAspectRatio,
      saveToGallery: this.saveToGallery
    };

    if (isAvailable()) {
      try {
        const imageAsset = await takePicture(options);
        this.imageTaken = imageAsset;
        const source = new ImageSource();
        const imageSource = await fromAsset(imageAsset);
        setTimeout(() => {
          this.cropImage(imageSource);
        },isIOS ? 250 : 0);
      } catch (error) {
        this.utils.sendErrorToCrashlytics("appLog", error);
        console.error(error);
      }
    }
  }

  async cropImage(imageSource) {
    try {
      const imageCropper: ImageCropper = new ImageCropper();
      const result: ImageSource = (
        await imageCropper.show(imageSource, {
          width: 150,
          height: 140,
          lockSquare: false
        })
      ).image;
      if (result) {
        this.profileImage.image = `data:image/jpeg;base64,${result.toBase64String(
          "jpeg",
          100
        )}`;
        this.saveProfileImage();
        this.cd.detectChanges();
      }
    } catch (error) {
      this.utils.sendErrorToCrashlytics("appLog", error);
      console.error(error);
    }
  }

  async changeProfilePictureFromGallery() {
    try {
      let imageSource = new ImageSource();
      const context = imagepicker.create({
        mode: "single" // use "multiple" for multiple selection
      });
      await context.authorize();
      const selection = await context.present();
      const imageAsset = selection.length > 0 ? selection[0] : null;
      imageAsset.options = {
        width: this.width,
        height: this.height,
        keepAspectRatio: true
      };
      imageSource = await fromAsset(imageAsset);
      setTimeout(() => {
        this.cropImage(imageSource);
      }, 1);
    } catch (error) {
      this.utils.sendErrorToCrashlytics("appLog", error);
      console.error(error);
    }
  }

  saveProfileImage() {
    this.getUserFromFormValue(false, "");
    this.assignImageValues();
    this.saveUser(
      this.user,
      this.user.location !== this.userCopyForReset.location ? true : false
    );
  }

  assignImageValues(): void {
    const fileName = `${new Date().getTime()}.jpg`;
    this.user.profilePicture = fileName;
    this.user.originalImageUrl = this.profileImage.image;
    this.user.croppedImageUrl = this.profileImage.image;
    this.user.imageType = "image/jpeg";
    this.userForm.get("profilePicture").setValue(fileName);
    this.userForm.updateValueAndValidity();
  }

  addCustomTag() {
    this.hideKeyboard();
    this.enteredTags.push(this.customTag);
    this.customTag = "";
    this.autocomplete.autoCompleteTextView.resetAutoComplete();
  }

  selectCategory(category) {
    category.isSelected = !category.isSelected ? true : false;
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

  setBulkUploadRequest(): void {
    const userForm = this.userForm.value;
    if (
      !userForm.name ||
      !userForm.displayName ||
      !userForm.location ||
      !userForm.profilePicture
    ) {
      this.uUtils.showMessage(
        "error",
        "Please add name, display name, location and profile picture for bulk upload request"
      );
    } else {
      this.onSubmit();
    }
  }

  formEditOpen(fieldName: string) {
    this.editSingleField(fieldName);
    if (fieldName == "socialProfile") {
      this.cd.markForCheck();
      const socialField = this.socialField.toArray();
      if (socialField.length) {
        this.uUtils.focusTextField(socialField[0]);
      }
    }
  }

  onSubmit(isEditSingleField = false, field = "", position = -1) {
    // validations
    if (field === "location") {
      this.editLocationField();
    }
    if (field === "socialProfile") {
      this.singleFieldEdit[field] = false;
    }

    if (field === "displayName") {
      this.isSavingUserName = true;
    }

    this.setValidation(field);

    this.userForm.updateValueAndValidity();

    if (this.profileImageFile) {
      this.assignImageValues();
    }

    if (this.userForm.invalid) {
      this.isSavingUserName = false;
      this.utils.showMessage("error", "Please fill the field");
      return;
    }

    this.checkDisplayName(this.userForm.get("displayName").value);
    this.singleFieldEdit[field] = false;
    this.subscriptions.push(
      this.store
        .select(coreState)
        .pipe(select(s => s.checkDisplayName))
        .subscribe(status => {
          this.isValidDisplayName = status;
          if (this.isValidDisplayName !== null) {
            if (this.isValidDisplayName) {
              // get user object from the forms
              this.getUserFromFormValue(true, field);
              this.user.categoryIds = this.userCategories
                .filter(c => c.isSelected)
                .map(c => c.id);
              // call saveUser
              this.saveUser(
                this.user,
                this.user.location !== this.userCopyForReset.location
                  ? true
                  : false
              );
            } else {
              this.isSavingUserName = false;
              this.singleFieldEdit.displayName = true;
              this.userForm.controls["displayName"].setErrors({ exist: true });
              this.userForm.controls["displayName"].markAsTouched();
              this.cd.markForCheck();
            }
            this.toggleLoader(false);
          }
        })
    );
  }

  hideKeyboard() {
    this.utils.hideKeyboard(this.textField);
  }

  openUrl(url, id) {
    const fullUrl = `${url}${id}`;
    utils.openUrl(fullUrl);
  }

  ngOnDestroy() {
  }

  async getLocation() {
    await this.getLocationPermission();
    if (this.isLocationEnalbed) {
      try {
        const position = await geolocation.getCurrentLocation({});
        if (position) {
          console.log('points>>', position);
          this.user.geoPoint = new firebase.firestore().GeoPoint(position.latitude, position.longitude);
          this.store.dispatch(
            this.userAction.loadAddressUsingLatLong(
              `${position.latitude},${position.longitude}`
            )
          );
        }
      } catch (e) {
        console.log("Error: " + (e.message || e));
      }
    } else {
      const options = {
        context: {},
        fullscreen: false,
        viewContainerRef: this.vcRef
      };
      this.modal.showModal(LocationResetDialogComponent, options);
    }
  }
  async getLocationPermission() {
    const isEnable = await geolocation.isEnabled();
    try {
      if (isEnable) {
        this.isLocationEnalbed = true;
      } else {
        await geolocation.enableLocationRequest();
        this.isLocationEnalbed = await geolocation.isEnabled();
      }
    } catch (e) {
      this.isLocationEnalbed = false;
      console.log("Error: " + (e.message || e));
    }
  }

  formSubmitted(fieldName) {
    this.onSubmit(true, fieldName);
  }

  redirectToChangePassword() {
    this.routerExtensions.navigate(["/user/my/profile/change-password"]);
  }

  navigateToPrivacyPolicy() {
    this.routerExtensions.navigate(["/privacy-policy"]);
  }

  navigateToTermsConditions() {
    this.routerExtensions.navigate(["/terms-and-conditions"]);
  }

  navigateToUserFeedback() {
    this.routerExtensions.navigate(["/user-feedback"]);
  }

  getCurrentLocation($event) {
    this.getLocation();
  }
}
