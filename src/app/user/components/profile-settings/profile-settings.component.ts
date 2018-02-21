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


  name: string;
  data: any;
  cropperSettings: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;


  file: File;

  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  get categoryList(): FormArray {
    return this.userForm.get('categoryList') as FormArray;
  }

  get socialAccountList(): FormArray {
    return this.userForm.get('socialAccountList') as FormArray;
  }

  constructor(private fb: FormBuilder, private store: Store<AppStore>, private userActions: UserActions) {
    this.categoriesObs = store.select(s => s.categories);
    this.subs.push(this.categoriesObs.subscribe(categories => {
      this.categories = categories;
    }));
    this.categoryDictObs = store.select(s => s.categoryDictionary);
    this.subs.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));

    this.userObs = this.store.select(s => s.userInfosById);


    this.name = 'Angular2'
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
        if (this.userObject !== undefined) {
          this.createForm(this.userObject);
        }
      }));

    }));
  }

  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
  }

  fileChangeListener($event) {
    const image: any = new Image();
    this.file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);

    };
    console.log(this.file);
    myReader.readAsDataURL(this.file);
  }

  saveProfileImage() {
    console.log(this.file);
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


    // let fcs: FormControl[] = question.tags.map(tag => {
    //   let fc = new FormControl(tag);
    //   return fc;
    // });
    // if (fcs.length == 0)
    //   fcs = [new FormControl('')];
    // let tagsFA = new FormArray(fcs);

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
      privateProfileSetting: [user.privateProfileSetting]
    });
  }


  onFileChange(event) {
    const fileList: FileList = event.target.files;

    if (fileList.length === 0) {
      console.log('Please select Logo');
    } else {
      const file: File = fileList[0];
      const fname = file.name;
      const fsize = file.size;
      const ftype = file.type;
      if (fsize > 1048576) {
        console.log('Your uploaded logo is not larger than 1 MB.');
      } else {
        if (ftype === 'image/jpeg' || ftype === 'image/jpg' || ftype === 'image/png') {


          // this.layoutService.showLoading();
          // this.formData = new FormData();
          // this.formData.append('uploadFile', file, file.name);
          // const formData: FormData = new FormData();
          // formData.append('uploadFile', file, file.name);

          const reader = new FileReader();

          reader.addEventListener('load', () => {
            this.profileImage = reader.result;
          }, false);

          if (file) {
            reader.readAsDataURL(file);
          }
          // this._spService.uploadLogo(formData, this.service_provider.id.toString()).subscribe(response => {
          // this.layoutService.hideLoading();
          // this.service_provider.logo = response.original.data.logo;
          // this.serviceProvider.emit(this.service_provider);
          // if (this.service_provider.logo != null && !this.isUserAdmin) {
          //   this.layoutService.setCompanyLogo(environment.apiUrl + 'serviceprovider/logo/' + this.service_provider.logo);
          // }
          // swal('Success', response.original.msg.toString(), 'success');
          // }, (err) => {
          // this.layoutService.hideLoading();
          // SharedUtilities.handleError(err);
          // console.log('erroor');
          // });
        } else {
          console.log('Only PNG, JPG and JPEG Type Allow.');
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


    // console.log(JSON.stringify(this.user));

    // call saveUser
    this.saveUser(this.user);
  }

  saveUser(user: User) {
    this.store.dispatch(this.userActions.addUserProfileData(user));
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

  }



  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }

}
