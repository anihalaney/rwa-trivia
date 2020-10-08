import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { User } from 'shared-library/shared/model/user';
import { Store, select } from '@ngrx/store';
import { CoreState, coreState } from './../../../core/store';
import { UserActions } from 'shared-library/core/store';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-extra-info',
  templateUrl: './signup-extra-info.component.html',
  styleUrls: ['./signup-extra-info.component.scss']
})
@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class SignupExtraInfoComponent implements OnInit, OnDestroy {
  user: User;
  phoneEditable: Boolean = true;
  emailEditable: Boolean = true;
  subscriptions = [];
  userForm: FormGroup;
  checkUserSubscriptions: Subscription;
  isValidDisplayName: boolean = null;
  // tslint:disable-next-line:max-line-length
  email_regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    public fb: FormBuilder,
    public store: Store<CoreState>,
    public userAction: UserActions,
    public cd: ChangeDetectorRef,
    public router: Router
  ) {
    this.userForm = new FormGroup(
      {
        email: new FormControl('', { validators: [Validators.pattern(this.email_regexp)] }),
        phoneNo: new FormControl('', { validators: [Validators.maxLength(13), Validators.minLength(9)] }),
        displayName: new FormControl('', Validators.required),
      }
    );
  }

  ngOnInit() {
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user)).subscribe((user) => {
      if (user) {
        this.user = user;
        this.userForm.patchValue(
          {
            email: this.user.email || '',
            phoneNo: this.user.phoneNo || '',
            displayName: this.user.displayName || ''
          }
        );
        this.emailEditable = (!this.user.email) ? true : false;
        this.phoneEditable = (!this.user.phoneNo) ? true : false;
      }

    }));

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.checkDisplayName)).subscribe(status => {
      if (this.router.url === '/signup-extra-info') {
        this.isValidDisplayName = status;
        if (this.isValidDisplayName !== null && this.isValidDisplayName !== undefined) {
          if (this.isValidDisplayName) {
            const data = this.userForm.value;
            this.user.phoneNo = data.phoneNo;
            this.user.email = data.email;
            this.user.displayName = data.displayName;
            this.store.dispatch(this.userAction.addUserProfile(this.user, false));
            this.router.navigate(['select-category-tag']);
            this.cd.markForCheck();
          } else {
            this.userForm.controls['displayName'].setErrors({ 'exist': true });
            this.userForm.controls['displayName'].markAsTouched();
            this.cd.markForCheck();
          }
          this.isValidDisplayName = null;
        }
      }
    }));
  }

  checkDisplayName(displayName: string) {
    this.store.dispatch(this.userAction.checkDisplayName(displayName));
  }

  submit() {
    this.userForm.updateValueAndValidity();
    if (this.userForm.invalid) {
      return;
    } else {
      const data = this.userForm.value;
      this.checkDisplayName(data.displayName);
    }
  }

  ngOnDestroy() {

  }
}
