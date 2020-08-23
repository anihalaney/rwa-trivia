import { Component, OnDestroy, ChangeDetectorRef, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { select, Store } from "@ngrx/store";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { CoreState, coreState } from "../../../../core/store";
import { User } from "shared-library/shared/model";
import { Utils } from "../../../../core/services";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Page } from "tns-core-modules/ui/page";
import { AuthenticationProvider } from "shared-library/core/auth";

@Component({
  selector: "ns-change-password",
  moduleId: module.id,
  templateUrl: "change-password.component.html",
  styleUrls: ["change-password.component.css"]
})
@AutoUnsubscribe({ arrayName: "subscriptions" })
export class ChangePasswordComponent implements OnDestroy, OnInit {
  user: User;
  subscriptions = [];
  passwordForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    private routerExtensions: RouterExtensions,
    public store: Store<CoreState>,
    public cd: ChangeDetectorRef,
    public utils: Utils,
    private page: Page,
    public authenticationProvider: AuthenticationProvider
  ) {
    this.page.actionBarHidden = true;
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', Validators.minLength(6)],
        password: ['', Validators.minLength(6)],
        confirmPassword: ['', Validators.minLength(6)]
      },
      { validator: profileUpdateFormValidator }
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store
        .select(coreState)
        .pipe(select(s => s.user))
        .subscribe(user => {
          this.user = user;
        })
    );
  }

  back() {
    this.routerExtensions.back();
  }

  ngOnDestroy() { }

  async saveUser() {
    const currentPassword = this.passwordForm.get('oldPassword').value;
    const newPassword = this.passwordForm.get('password').value;
    if (
      currentPassword &&
      currentPassword !== null &&
      currentPassword.length > 0 &&
      newPassword &&
      newPassword !== null &&
      newPassword.length > 0
    ) {
      try {
        await this.authenticationProvider.updatePassword(
          this.user.email,
          currentPassword,
          newPassword
        );
        this.utils.showMessage(
          'success',
          'Your password has been changed successfully.'
        );
        this.back();
      } catch (error) {
        if (error && error != {}) {
          this.utils.showMessage('error', 'The password is invalid or the user does not have a password.');
        }
      }
    }
  }
}

function profileUpdateFormValidator(fg: FormGroup): { [key: string]: boolean } {
  // Password match validation for password update only
  if (
    fg.get('password') &&
    fg.get('confirmPassword') &&
    fg.get('password').value &&
    fg.get('confirmPassword').value
  ) {
    if (fg.get('password').value !== fg.get('confirmPassword').value) {
      return { passwordmismatch: true };
    }

    if (!fg.get('oldPassword') || !fg.get('oldPassword').value) {
      return { requiredoldpassword: true };
    }
    return null;
  }
  return null;
}
