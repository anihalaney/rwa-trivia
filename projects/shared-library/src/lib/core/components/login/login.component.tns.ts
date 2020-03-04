import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormBuilder, NgModel } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as application from 'application';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { RouterExtensions } from 'nativescript-angular/router';
import { setString } from 'nativescript-plugin-firebase/crashlytics/crashlytics';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { android, AndroidActivityBackPressedEventData, AndroidApplication } from 'tns-core-modules/application';
import { isAndroid, isIOS } from 'tns-core-modules/platform';
import { Page } from 'tns-core-modules/ui/page';
import { CountryListComponent } from '../../../shared/mobile/component/countryList/countryList.component';
import { PhoneNumberValidationProvider } from '../../../shared/mobile/component/countryList/phone-number-validation.provider';
import { CoreState, coreState, UIStateActions } from '../../store';
import { FirebaseAuthService } from './../../auth/firebase-auth.service';
import { Login } from './login';
import { Utils } from '../../services';
declare var IQKeyboardManager;
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe({ arrayName: 'subscriptions' })
export class LoginComponent extends Login implements OnInit, OnDestroy {
  iqKeyboard: any;
  @ViewChildren('textField') textField: QueryList<ElementRef>;
  title: string;
  loader = false;
  message = {
    show: false,
    type: '',
    text: ''
  };

  @ViewChild('phoneNumber', { static: false }) phoneNumber: NgModel;
  isCountryListOpened = false;
  isCountryCodeError;
  input: any;
  country: any;
  dialogCloseSubject = new Subject();
  dialogCloseObservable = this.dialogCloseSubject.asObservable();

  constructor(
    private modalDialogService: ModalDialogService,
    public fb: FormBuilder,
    public store: Store<CoreState>,
    public routerExtension: RouterExtensions,
    private uiStateActions: UIStateActions,
    private page: Page,
    private firebaseAuthService: FirebaseAuthService,
    private utils: Utils,
    public cd: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private phonenumber: PhoneNumberValidationProvider
  ) {
    super(fb, store, cd);
    this.page.actionBarHidden = true;

    this.input = {
      selectedCountry: 'United States',
      countryCode: '+1',
      phoneNumber: '',
      country: 'us',
    };
    if (isIOS) {
      this.iqKeyboard = IQKeyboardManager.sharedManager();
      this.iqKeyboard.shouldResignOnTouchOutside = true;
    }
  }

  private validateNumber(): boolean {
    return this.phonenumber.isValidMobile(this.input.phoneNumber, this.input.country);
  }

  async signInWithPhone() {
    if (this.input.selectedCountry === '') {
      this.isCountryCodeError = true;
      return false;
    }

    if (!this.validateNumber()) {
      this.phoneNumber.control.setErrors({ 'invalid': true });
      this.phoneNumber.control.markAsDirty();
      this.cd.markForCheck();
      return false;
    }

    try {
      const result = await this.firebaseAuthService.phoneLogin(`${this.input.countryCode}${this.input.phoneNumber}`);
      if (result) {
        JSON.stringify(result);
        this.redirectTo();
      }
    } catch (errorMessage) {
      console.error(errorMessage);
      this.utils.showMessage('error', errorMessage);
      this.cd.markForCheck();
    }
  }

  async onSelectCountry() {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: { Country: this.country, closeObserver: this.dialogCloseObservable }
    };
    try {
      this.isCountryListOpened = true;
      const result = await this.modalDialogService.showModal(CountryListComponent, options);

      if (result === undefined && this.input.selectedCountry === null) {
        this.isCountryCodeError = true;
      } else if (result) {
        setString('countryCode', result.flagClass);
        this.input.country = result.flagClass;
        this.input.selectedCountry = result.name;
        this.input.countryCode = '+' + result.dialCode;
        this.isCountryCodeError = false;
      }
      this.isCountryListOpened = false;
      this.cd.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit() {
    this.handleBackButtonPress();
    this.title = 'Login';
    this.subscriptions.push(this.loginForm.get('mode').valueChanges.subscribe((mode: number) => {
      switch (mode) {
        case 1:
          // Sign up
          this.title = 'Get a bit wiser - Sign up';
          break;
        // no break - fall thru
        case 0:
          // Login or Sign up
          this.title = 'Login';
          break;
        default:
          // Forgot Password
          this.title = 'Forgot Password';
      }
      this.loginForm.get('password').updateValueAndValidity();
    }));
  }

  handleBackButtonPress() {
    if (isAndroid) {
      android.off(AndroidApplication.activityBackPressedEvent, this.handleBackButtonPressCallBack);
      android.on(application.AndroidApplication.activityBackPressedEvent, this.handleBackButtonPressCallBack, this);
    }
  }

  handleBackButtonPressCallBack(args: AndroidActivityBackPressedEventData) {
    if (this.routerExtension.canGoBack() && this.isCountryListOpened === false) {
      this.routerExtension.back();
    } else if (this.isCountryListOpened) {
      this.dialogCloseSubject.next(true);
    }
    args.cancel = true;
  }

  async onSubmit() {
    this.hideKeyboard();
    if (!this.loginForm.valid) {
      this.utils.showMessage('error', 'Please Fill the details');
      return;
    }

    if (!this.loginForm.value.tnc && this.mode === 1) {
      this.utils.showMessage('error', 'Please accept terms & conditions');
      return;
    }

    this.loader = true;
    this.removeMessage();
    let user;
    try {
      switch (this.mode) {
        case 0:
          // Login
          user = await this.firebaseAuthService.signInWithEmailAndPassword(
            this.loginForm.value.email,
            this.loginForm.value.password
          );
          if (user) {
            this.redirectTo();
          }
          break;
        case 1:
          // Sign up
          user = await this.firebaseAuthService.createUserWithEmailAndPassword(
            this.loginForm.value.email,
            this.loginForm.value.password
          );
          if (user) {
            // Success
            if (user && !user.emailVerified) {
              await this.firebaseAuthService.sendEmailVerification(user);
              this.redirectTo();
            }
          }
          break;
        case 2:
          // Forgot Password
          user = await this.firebaseAuthService.sendPasswordResetEmail(this.loginForm.value.email);
          this.notificationMsg = `email sent to ${this.loginForm.value.email}`;
          this.utils.showMessage('success', this.notificationMsg);
          this.loader = false;
          this.errorStatus = false;
          this.notificationLogs.push(this.loginForm.get('email').value);
          this.store.dispatch(this.uiStateActions.saveResetPasswordNotificationLogs([this.loginForm.get('email').value]));
      }
    } catch (error) {
      this.loader = false;
      switch (this.mode) {
        case 0:
          const singInError = error.message.split(':');
          this.utils.showMessage('error', singInError[1] || error.message);
          break;
        case 1:
          if (user && !user.emailVerified) {
            const verificationError = error.split(':');
            this.utils.showMessage('error', verificationError[1] || error);
          } else {
            const singUpError = error.split(':');
            this.utils.showMessage('error', singUpError[1] || error);
          }
          break;
        case 2:
          this.utils.showMessage('error', error);
          break;
      }
      this.cd.markForCheck();
    } finally {
      this.cd.markForCheck();
    }
  }

  async googleLogin() {
    this.removeMessage();
    this.loader = true;
    try {
      const result = await this.firebaseAuthService.googleLogin();
      if (result) {
        this.redirectTo();
      }
    } catch (error) {
      this.loader = false;
      this.utils.showMessage('error', error);
      this.cd.markForCheck();
    }
  }

  async fbLogin() {
    try {
      this.removeMessage();
      this.loader = true;
      const result = await this.firebaseAuthService.facebookLogin();
      this.redirectTo();
    } catch (error) {
      this.loader = false;
      this.utils.showMessage('error', error);
      this.cd.markForCheck();
    }
  }

  async appleSignIn() {
    try {
      this.removeMessage();
      this.loader = true;
      const result = await this.firebaseAuthService.appleLogin();
      this.redirectTo();
    } catch (error) {
      this.loader = false;
      this.utils.showMessage('error', error);
      this.cd.markForCheck();
    }
  }

  redirectTo() {
    this.subscriptions.push(this.store.select(coreState).pipe(
      map(s => s.user),
      filter(u => u !== null && u.userId !== ''),
      take(1)).subscribe(user => {
        this.loader = false;
        this.subscriptions.push(this.store.select(coreState).pipe(
          map(s => s.loginRedirectUrl), take(1)).subscribe(url => {
            const redirectUrl = url ? url : '/dashboard';
            if (this.mode === 0 || this.mode === 1) {
              if (!user.isCategorySet && this.applicationSettings.show_category_screen && !user.categoryIds && !user.tags) {
                this.navigateTo('signup-extra-info', this.mode);
              } else {
                this.navigateTo(redirectUrl, this.mode);
              }
            } else {
              this.navigateTo(redirectUrl, this.mode);
            }
            this.cd.markForCheck();
          })
        );
      })
    );
  }

  navigateTo(redirectUrl, mode) {
    if (mode === 0) {
      this.utils.showMessage('success', 'You have been successfully logged in');
    } else {
      this.utils.showMessage('success', 'You have been successfully signed up');
    }
    this.routerExtension.navigate([redirectUrl], { clearHistory: true });
  }

  showMessage(type: string, text: string) {
    this.message = {
      show: true,
      type: type,
      text: text
    };
  }

  changeMode(mode) {
    if (mode === '/dashboard') {
      this.routerExtension.navigate([mode], { clearHistory: true });
    } else if (mode === 'email') {
      this.signInMethod = mode;
      super.changeMode(0);
      this.removeMessage();
    } else {
      super.changeMode(mode);
      this.removeMessage();
    }
  }

  removeMessage() {
    this.message = {
      show: false,
      type: '',
      text: ''
    };
  }

  ngOnDestroy() {
    if (isAndroid) {
      android.off(AndroidApplication.activityBackPressedEvent, this.handleBackButtonPressCallBack);
    }
  }

  hideKeyboard() {
    this.utils.hideKeyboard(this.textField);
  }
}
