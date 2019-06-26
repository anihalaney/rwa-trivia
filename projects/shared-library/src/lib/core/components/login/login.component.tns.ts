import {
   ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList,
  ViewChild, ViewChildren, ViewContainerRef
} from '@angular/core';
import { FormBuilder, NgModel } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as application from 'application';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { RouterExtensions } from 'nativescript-angular/router';
import { LoadingIndicator } from 'nativescript-loading-indicator';
import { setString } from 'nativescript-plugin-firebase/crashlytics/crashlytics';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { android, AndroidActivityBackPressedEventData, AndroidApplication, } from 'tns-core-modules/application';
import { isAndroid } from 'tns-core-modules/platform';
import { Page } from 'tns-core-modules/ui/page';
import { CountryListComponent } from '../../../shared/mobile/component/countryList/countryList.component';
import { PhoneNumberValidationProvider } from '../../../shared/mobile/component/countryList/phone-number-validation.provider';
import { CoreState, coreState, UIStateActions } from '../../store';
import { FirebaseAuthService } from './../../auth/firebase-auth.service';
import { Login } from './login';
import { Utils } from '../../services';
import { Parameter, User } from '../../../shared/model';
import * as firebase from 'nativescript-plugin-firebase';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class LoginComponent extends Login implements OnInit, OnDestroy {
  @ViewChildren('textField') textField: QueryList<ElementRef>;
  title: string;
  loader = new LoadingIndicator();
  loaderOptionsCommon = { android: { color: '#3B5998' }, ios: { color: '#4B9ED6' }, message: 'Loading' };
  message = {
    show: false,
    type: '',
    text: ''
  };
  subscriptions = [];
  @ViewChild('phoneNumber') phoneNumber: NgModel;
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
    private phonenumber: PhoneNumberValidationProvider) {
    super(fb, store, cd);
    this.page.actionBarHidden = true;

    this.input = {
      selectedCountry: 'United States',
      countryCode: '+1',
      phoneNumber: '',
      country: 'us',
    };
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
      this.showMessage('error', errorMessage);
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
      return;
    }
    this.loader.show(this.loaderOptionsCommon);
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
              const isEmailVerify = await this.firebaseAuthService.sendEmailVerification(user);
              if (isEmailVerify) {
                this.redirectTo();
              }
            }
          }
          break;
        case 2:
          // Forgot Password
          user = await this.firebaseAuthService.sendPasswordResetEmail(this.loginForm.value.email);
          this.notificationMsg = `email sent to ${this.loginForm.value.email}`;
          this.showMessage('success', this.notificationMsg);
          this.loader.hide();
          this.errorStatus = false;
          this.notificationLogs.push(this.loginForm.get('email').value);
          this.store.dispatch(this.uiStateActions.saveResetPasswordNotificationLogs([this.loginForm.get('email').value]));

      }

    } catch (error) {
      this.loader.hide();
      switch (this.mode) {
        case 0:
          const singInError = error.message.split(':');
          this.showMessage('error', singInError[1] || error.message);
          break;
        case 1:
          if (user && !user.emailVerified) {
            const verificationError = error.split(':');
            this.showMessage('error', verificationError[1] || error);
          } else {
            const singUpError = error.split(':');
            this.showMessage('error', singUpError[1] || error);
          }
          break;
        case 2:
          this.showMessage('error', error);
          break;
      }
      this.cd.markForCheck();

    } finally {
      this.cd.markForCheck();
    }

  }

  async googleLogin() {
    this.removeMessage();
    if (isAndroid) {
      this.loader.show(this.loaderOptionsCommon);
    }
    try {
      const result = await this.firebaseAuthService.googleLogin();
      if (result) {
        this.redirectTo();
      }
    } catch (error) {
      this.loader.hide();
      this.showMessage('error', error);
      this.cd.markForCheck();
    }

  }

  async fbLogin() {
    try {
      this.removeMessage();
      if (isAndroid) {
        this.loader.show(this.loaderOptionsCommon);
      }
      const result = await this.firebaseAuthService.facebookLogin();
      this.redirectTo();
    } catch (error) {
      this.loader.hide();
      this.showMessage('error', error);
      this.cd.markForCheck();
    }
  }

  redirectTo() {
    this.subscriptions.push(this.store.select(coreState).pipe(
      map(s => s.user),
      filter(u => (u != null && u.userId !== '')),
      take(1)).subscribe((user) => {
        this.setLoginFirebaseAnalyticsParameter(user);
        this.loader.hide();

        this.subscriptions.push(this.store.select(coreState).pipe(
          map(s => s.loginRedirectUrl), take(1)).subscribe(url => {
            const redirectUrl = url ? url : '/dashboard';
            this.utils.showMessage('success', 'You have been successfully logged in');
            this.routerExtension.navigate([redirectUrl], { clearHistory: true });
            this.cd.markForCheck();
          }));
      }
      ));
  }


  setLoginFirebaseAnalyticsParameter(user: User) {

    const analyticsParameter: Parameter[] = [];

    const userId: Parameter = {
      key: 'userId',
      value: user.userId
    };
    analyticsParameter.push(userId);

    console.log('analyticsParameter ==> ', analyticsParameter);

    firebase.analytics.logEvent({
      key: 'user_login',
      parameters: analyticsParameter
    }).then(() => {
      console.log('user_login event slogged');
    });

  }

  showMessage(type: string, text: string) {
    this.message = {
      show: true,
      type: type,
      text: text
    };
  }

  changeMode(mode: number) {
    super.changeMode(mode);
    this.removeMessage();
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
   this.textField
    .toArray()
      .map((el) => {
        if (isAndroid) {
          el.nativeElement.android.clearFocus();
        }
        return el.nativeElement.dismissSoftInput();
      });
  }
}

