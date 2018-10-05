import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  mode: SignInMode;
  loginForm: FormGroup;
  notificationMsg: string;
  errorStatus: boolean;
  notificationLogs: string[];

  constructor(private fb: FormBuilder) {

    this.mode = SignInMode.signIn;  //default
    this.notificationMsg = '';
    this.errorStatus = false;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      mode: [0],
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['']
    }, { validator: loginFormValidator }
    );

    this.loginForm.get('mode').valueChanges.subscribe((mode: number) => {
      switch (mode) {
        case 1:
          //Signup          
          this.loginForm.get('confirmPassword').setValidators(Validators.compose([Validators.required, Validators.minLength(6)]));
          this.loginForm.get('confirmPassword').updateValueAndValidity();
          break;
        //no break - fall thru
        case 0:
          //Login or Signup       
          this.loginForm.get('confirmPassword').clearValidators();
          this.loginForm.get('password').setValidators(Validators.compose([Validators.required, Validators.minLength(6)]));
          this.loginForm.get('password').updateValueAndValidity();
          break;
        default:
          //Forgot Password
          this.loginForm.get('password').clearValidators();
          this.loginForm.get('confirmPassword').clearValidators();

      }
      this.loginForm.get('password').updateValueAndValidity();
      this.notificationMsg = '';
      this.errorStatus = false;
    });

   
  }

  onSubmit() {

  }

  googleLogin() {
  
  }

  fbLogin() {
   
  }

  twitterLogin() {

  }

  githubLogin() {
 
  }

  validateLogs() {
    if (this.notificationLogs.indexOf(this.loginForm.get('email').value) !== -1) {
      this.notificationMsg = `email has already sent to ${this.loginForm.get('email').value}`;
      return true;
    }
    this.notificationMsg = '';
    return false;
  }

  ngOnDestroy() {
  
  }
}

export enum SignInMode {
  signIn,
  signUp,
  forgotPassword
}

function loginFormValidator(fg: FormGroup): { [key: string]: boolean } {
  //TODO: check if email is already taken

  //Password match validation for Signup only
  if (fg.get('mode').value === 1 && fg.get('password') && fg.get('confirmPassword')
    && fg.get('password').value && fg.get('confirmPassword').value
    && fg.get('password').value !== fg.get('confirmPassword').value) {
    return { 'passwordmismatch': true }
  }

  return null;
}
