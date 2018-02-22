import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { UserActions } from '../../../core/store/actions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AppStore } from '../../../core/store/app-store';
import { Utils } from '../../../core/services';
import { User, Category } from '../../../model';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ngx-img-cropper';
import { AngularFireStorage } from 'angularfire2/storage';


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

  profileImage: { image: any } = { image: '/assets/images/avatarimg.jpg' };
  basePath = '/profile';
  profileImagePath = 'avatar';
  originalImagePath = 'original';
  profileImageValidation: String;
  profileImageFile: File;

  cropperSettings: CropperSettings;

  @ViewChild('cropper') cropper: ImageCropperComponent;

  get categoryList(): FormArray {
    return this.userForm.get('categoryList') as FormArray;
  }

  get socialAccountList(): FormArray {
    return this.userForm.get('socialAccountList') as FormArray;
  }

  constructor(private fb: FormBuilder,
    private store: Store<AppStore>,
    private storage: AngularFireStorage,
    private userActions: UserActions,
    private snackBar: MatSnackBar) {
    this.subs.push(this.store.take(1).subscribe(s => this.user = s.user));
    this.categoriesObs = store.select(s => s.categories);
    this.subs.push(this.categoriesObs.subscribe(categories => this.categories = categories));
    this.categoryDictObs = store.select(s => s.categoryDictionary);
    this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
    this.setCropperSettings();
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

  // Lifecycle hooks
  ngOnInit() {
    this.store.dispatch(this.userActions.loadUserProfile(this.user));
    this.userObs = this.store.select(s => s.user);
    this.subs.push(this.userObs.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.createForm(this.user);
        if (this.user.profilePicture) {
          const filePath = `${this.basePath}/${this.user.userId}/${this.profileImagePath}/${this.user.profilePicture}`;
          const ref = this.storage.ref(filePath);
          ref.getDownloadURL().subscribe(res => {
            this.profileImage.image = res;
          });
        }
      }
    }));

    this.subs.push(this.store.select(s => s.userProfileSaveStatus)
      .subscribe(status => {
        if (status === 'SUCCESS') {
          this.snackBar.open('Profile saved!', '', { duration: 2000 });
        }
      }));
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
        this.cropper.setImage(image);
      };
    }
  }

  validateImage(fileList: FileList) {
    if (fileList.length === 0) {
      this.profileImageValidation = 'Please select Profile picture';
    } else {
      const file: File = fileList[0];
      const fimeName = file.name;
      const fileSize = file.size;
      const fileType = file.type;

      if (fileSize > 2097152) {
        this.profileImageValidation = 'Your uploaded logo is not larger than 2 MB.';
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
      const file = this.profileImageFile
      const imageBlob = this.dataURItoBlob(this.profileImage.image);
      const fileName = `${new Date().getTime()}-${this.profileImageFile.name}`;
      this.storage.upload(`${this.basePath}/${this.user.userId}/${this.originalImagePath}/${fileName}`, this.profileImageFile);
      if (imageBlob) {
        // tslint:disable-next-line:max-line-length
        const cropperImageUploadTask = this.storage.upload(`${this.basePath}/${this.user.userId}/${this.profileImagePath}/${fileName}`, imageBlob);
        cropperImageUploadTask.downloadURL().subscribe(url => {
          this.profileImage.image = url ? url : '/assets/images/avatarimg.jpg';
          this.user.profilePicture = fileName;
          this.profileImageFile = undefined;
          this.saveUser(this.user);
        });
      }
    }
  }

  // cropped image convert to blob object
  dataURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: this.profileImageFile.type
    });
  }

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
    this.user.profileSetting = formValue.profileSetting;
    this.user.profileLocationSetting = formValue.profileLocationSetting;
    this.user.privateProfileSetting = formValue.privateProfileSetting;
    this.user.profilePicture = formValue.profilePicture ? formValue.profilePicture : '';
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

  saveUser(user: User) {
    this.store.dispatch(this.userActions.addUserProfile(user));
  }

  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

}
