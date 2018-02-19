import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { UserActions } from '../../../core/store/actions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AppStore } from '../../../core/store/app-store';
import { Utils } from '../../../core/services';
import { User, Category } from '../../../model';


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
  }

  // Lifecycle hooks
  ngOnInit() {
    this.subs.push(this.store.select(s => s.user).subscribe(user => {
      this.user = user;
      this.createForm(this.user);
    }));
  }

  createForm(user: User) {
    // console.log('user', user);
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
    }
    );
  }

  onSubmit() {
    // validations
    this.userForm.updateValueAndValidity();
    if (this.userForm.invalid) {
      return;
    }

    // get user object from the forms
    console.log(this.userForm.value);
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
