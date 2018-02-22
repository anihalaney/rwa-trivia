import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { UserActions } from '../../../core/store/actions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AppStore } from '../../../core/store/app-store';
import { Utils } from '../../../core/services';
import { User, Category } from '../../../model';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatSnackBar } from '@angular/material';
import * as firebase from 'firebase';


@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  @Input() user: User;

  // Properties
  categories: Category[];
  categoryDict: { [key: number]: Category };
  categoryDictObs: Observable<{ [key: number]: Category }>;
  subs: Subscription[] = [];
  categoriesObs: Observable<Category[]>;
  userForm: FormGroup;
  profileOptions: string[] = ['Only with friends', 'General', 'Programming', 'Architecture'];

  userObs: Observable<User>;
  userObject: User;


  profileImage: String;
  data: any;
  cropperSettings: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;
  imageValidation: String;

  file: File;
  croppedFileBlobObject: Blob;

  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  getImageUrl = false;
  basePath = '/profile_picture';
  croppedPicPath = 'croppedPic';
  originalPicPath = 'originalPic';

  get categoryList(): FormArray {
    return this.userForm.get('categoryList') as FormArray;
  }

  get socialAccountList(): FormArray {
    return this.userForm.get('socialAccountList') as FormArray;
  }

  constructor(private fb: FormBuilder,
    private store: Store<AppStore>,
    private storage: AngularFireStorage,
    public snackBar: MatSnackBar,
    private userActions: UserActions) {
    this.categoriesObs = store.select(s => s.categories);
    this.subs.push(this.categoriesObs.subscribe(categories => {
      this.categories = categories;
    }));
    this.categoryDictObs = store.select(s => s.categoryDictionary);
    this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));

    this.userObs = this.store.select(s => s.userInfosById);

    // For cropping image
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;

    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;

    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.canvasHeight = 300;

    this.cropperSettings.minWidth = 10;
    this.cropperSettings.minHeight = 10;

    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = false;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

    this.data = {};
    this.data.image = '/assets/images/avatarimg.jpg';

  }

  // Lifecycle hooks
  ngOnInit() {
    this.subs.push(this.store.select(s => s.user).subscribe(user => {
      this.user = user;
      this.createForm(this.user);

      this.store.dispatch(this.userActions.loadUserById(this.user));
      this.subs.push(this.userObs.subscribe((users) => {
        this.userObject = users[0];
        if (this.userObject) {
          this.createForm(this.userObject);
          if (!this.getImageUrl) {
            const filePath = `${this.basePath}/${this.userObject.userId}/${this.croppedPicPath}/${this.userObject.profilePicture}`;
            const ref = this.storage.ref(filePath);
            ref.getDownloadURL().subscribe(res => {
              this.data.image = res;
              this.getImageUrl = true;
            });
          }
        }
      }));
    }));
  }

  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
  }

  fileChangeListener($event) {
    this.onFileChange($event);
    if (!this.imageValidation) {
      const image: any = new Image();
      this.file = $event.target.files[0];
      const myReader: FileReader = new FileReader();
      const that = this;
      myReader.onloadend = function (loadEvent: any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);

      };
      myReader.readAsDataURL(this.file);
    }
  }

  // upload original and cropped image on fire storage
  saveProfileImage() {
    if (!this.imageValidation) {
      const storageRef = firebase.storage().ref();
      const file = this.file
      const reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
      }
      const fileName = `${new Date().getTime()}-${this.file.name}`;

      // original image upload on fire storage
      this.storage.upload(`${this.basePath}/${this.userObject.userId}/${this.originalPicPath}/${fileName}`, this.file);

      reader.addEventListener('load', () => {
        this.croppedFileBlobObject = this.dataURItoBlob(this.data.image);

        if (this.croppedFileBlobObject) {
          // cropped image upload on fire storage
          this.storage.upload(`${this.basePath}/${this.userObject.userId}/${this.croppedPicPath}/${fileName}`, this.croppedFileBlobObject);
          this.user.profilePicture = fileName;
          this.userObject = this.user;
          this.file = undefined;
          this.saveUser(this.user);
        }
      }, false);
    }
  }

  // cropped image convert to blob object
  dataURItoBlob(dataURI: any) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: this.file.type
    });
  }

  // create the form based on user object
  createForm(user: User) {
    const categoryIds: FormGroup[] = this.categories.map(category => {
      const status = (user.categoryIds && user.categoryIds.indexOf(category.id) !== -1) ? true : false
      const fg = new FormGroup({
        category: new FormControl(category.id),
        isSelected: new FormControl(status),
      });
      return fg;
    });
    const categoryFA = new FormArray(categoryIds);
    this.userForm = this.fb.group({
      name: [user.name, Validators.required],
      displayName: [user.displayName, Validators.required],
      location: [user.location, Validators.required],
      categoryList: categoryFA,
      facebookUrl: [user.facebookUrl],
      twitterUrl: [user.twitterUrl],
      linkedInUrl: [user.linkedInUrl],
      profileSetting: [(user.profileSetting) ? user.profileSetting :
        (this.profileOptions.length > 0 ? this.profileOptions[0] : '')],
      profileLocationSetting: [(user.profileLocationSetting) ? user.profileLocationSetting :
        (this.profileOptions.length > 0 ? this.profileOptions[0] : '')],
      privateProfileSetting: [user.privateProfileSetting],
      profilePicture: [user.profilePicture]
    });
  }


  // user profile validation
  onFileChange(event) {
    const fileList: FileList = event.target.files;

    if (fileList.length === 0) {
      this.imageValidation = 'Please select Logo';
    } else {
      const file: File = fileList[0];
      const fname = file.name;
      const fsize = file.size;
      const ftype = file.type;

      if (fsize > 2097152) {
        this.imageValidation = 'Your uploaded logo is not larger than 2 MB.';
      } else {
        if (ftype === 'image/jpeg' || ftype === 'image/jpg' || ftype === 'image/png' || ftype === 'image/gif') {
          this.imageValidation = undefined;
        } else {
          this.imageValidation = 'Only PNG, GIF, JPG and JPEG Type Allow.';
        }
      }
    }
  }

  onSubmit() {
    // validations
    this.userForm.updateValueAndValidity();
    if (this.userForm.invalid) {
      return;
    }
    // get user object from the forms
    this.getUserFromFormValue(this.userForm.value);
    // call saveUser
    this.saveUser(this.user);
  }

  // store the user object
  saveUser(user: User) {
    this.store.dispatch(this.userActions.addUserProfileData(user));
    this.snackBar.open('Profile Updated Successfuly', '', { duration: 3000 });
  }

  // Helper functions
  getUserFromFormValue(formValue: any): void {
    this.user.name = formValue.name;
    this.user.displayName = formValue.displayName;
    this.user.location = formValue.location;
    this.user.categoryIds = (this.user.categoryIds) ? this.user.categoryIds : [];
    for (const obj of formValue.categoryList) {
      if (obj['isSelected']) {
        this.user.categoryIds.push(obj['category']);
      }
    }
    this.user.facebookUrl = formValue.facebookUrl;
    this.user.linkedInUrl = formValue.linkedInUrl;
    this.user.twitterUrl = formValue.twitterUrl;
    this.user.profileSetting = formValue.profileSetting;
    this.user.profileLocationSetting = formValue.profileLocationSetting;
    this.user.privateProfileSetting = formValue.privateProfileSetting;
    this.user.profilePicture = formValue.profilePicture ? formValue.profilePicture : '';
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

}
