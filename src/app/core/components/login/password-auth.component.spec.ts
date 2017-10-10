import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement }    from '@angular/core';
import { ReactiveFormsModule }    from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { SharedMaterialModule } from '../../../shared/shared-material.module';
import { MatDialogRef, MatDialog } from '@angular/material';
import * as firebase from 'firebase/app';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthConfig, FirebaseAuthState } from 'angularfire2';

import { TEST_DATA } from '../../../testing';
import { PasswordAuthComponent, SignInMode } from './password-auth.component';
import { Category, Question, QuestionStatus }     from '../../../model';

describe('Component: PasswordAuthComponent', () => {

  let comp: PasswordAuthComponent;
  let fixture: ComponentFixture<PasswordAuthComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let _store: any;
  let afAuthMock = { "auth": {
                      "login": (auth: {method?: AuthMethods;
                                        provider?: AuthProviders;
                                    }) => {},
                      "createUser": (email: string, password: string) => {}
                     } 
                  };
  let dialogRef = { "close": () => {}};

  //Define intial state and test state
  let _user = TEST_DATA.userList[0];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordAuthComponent ], // declare the test component
      imports: [
        NoopAnimationsModule,
        //Material
        SharedMaterialModule,
        ReactiveFormsModule
      ],
      providers:[
        {provide: MatDialogRef, useValue: dialogRef},
        {provide: AngularFire, useValue: afAuthMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordAuthComponent);

    //get the injected instances
    //_store = fixture.debugElement.injector.get(Store);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    de = fixture.debugElement.query(By.css('h1'));
    _titleEl = de.nativeElement;

    //_categoryListEl = fixture.debugElement.query(By.css('mat-list')).nativeElement;
  }));

  it('Display Sign In title', () => {
    fixture.detectChanges();
    expect(_titleEl.textContent).toContain("Sign In");
  });

  it('Init', () => {
    comp.ngOnInit();

    fixture.detectChanges();

    let signinForm = comp.signinForm;
    expect(signinForm.get("email").value).toEqual(""); //initial form blank
    expect(signinForm.get("password").value).toEqual("");
    expect(signinForm.valid).toEqual(false);

    let signupForm = comp.signupForm;
    expect(signupForm.get("email").value).toEqual(""); //initial form blank
    expect(signupForm.get("password").value).toEqual("");
    expect(signupForm.get("confirmPassword").value).toEqual("");
    expect(signupForm.valid).toEqual(false);

    let forgotPasswordForm = comp.forgotPasswordForm;
    expect(forgotPasswordForm.get("email").value).toEqual(""); //initial form blank
    expect(forgotPasswordForm.valid).toEqual(false);
  });

  it('Mode: signIn',
    inject([
      AngularFire, MatDialogRef
    ],
    (af: AngularFire, dRef: MatDialogRef<PasswordAuthComponent>) => {

    fixture.detectChanges();

    let deForm = fixture.debugElement.query(By.css('form'));
    let deFormButton = deForm.query(By.css('button[type="submit"]'));
    
    ///"sign-in-form"
    expect(deFormButton.nativeElement.textContent).toContain("SIGN IN");

    let form = comp.signinForm;
    expect(form.valid).toEqual(false);

    form.get('email').setValue("test");
    expect(form.get('email').valid).toEqual(false);
    form.get('email').setValue("test@abc.com");
    expect(form.get('email').valid).toEqual(true);

    form.get('password').setValue("test");
    expect(form.get('password').valid).toEqual(false);
    form.get('password').setValue("Welcome321");
    expect(form.get('password').valid).toEqual(true);

    expect(form.valid).toEqual(true);

    let user: FirebaseAuthState = { 
      "uid": _user.userId,
      "provider" : AuthProviders.Google,
      "auth": null 
    };

    spyOn(af.auth, 'login')
        .and.callFake((emailPass: any, method: any) => Promise.resolve(user))
    let spy = spyOn(dRef, 'close')
      .and.callFake(() => { });

    comp.onSigninSubmit();
    expect(af.auth.login).toHaveBeenCalled();
    setTimeout(function() { //since the prior method is async call
            expect(spy).toHaveBeenCalled();
        },1000);
  }));

  it('Mode: signUp',
    inject([
      AngularFire, MatDialogRef
    ],
    (af: AngularFire, dRef: MatDialogRef<PasswordAuthComponent>) => {

    comp.mode = SignInMode.signUp;
    fixture.detectChanges();

    let deForm = fixture.debugElement.query(By.css('form'));
    let deFormButton = deForm.query(By.css('button[type="submit"]'));
    
    ///"sign-in-form"
    expect(deFormButton.nativeElement.textContent).toContain("SIGN UP");

    let form = comp.signupForm;
    expect(form.valid).toEqual(false);

    form.get('email').setValue("test");
    expect(form.get('email').valid).toEqual(false);
    form.get('email').setValue("test@abc.com");
    expect(form.get('email').valid).toEqual(true);

    form.get('password').setValue("test");
    expect(form.get('password').valid).toEqual(false);
    form.get('password').setValue("Welcome321");
    expect(form.get('password').valid).toEqual(true);

    form.get('confirmPassword').setValue("Welcome123");
    expect(form.get('confirmPassword').valid).toEqual(true);

    expect(form.valid).toEqual(false);
    expect(form.hasError('passwordmismatch')).toEqual(true);

    form.get('confirmPassword').setValue("Welcome321");
    expect(form.valid).toEqual(true);

    let user: FirebaseAuthState = { 
      "uid": _user.userId,
      "provider" : AuthProviders.Google,
      "auth": null 
    };

    spyOn(af.auth, 'createUser')
        .and.callFake((emailPass: any) => Promise.resolve(user))
    let spy = spyOn(dRef, 'close')
      .and.callFake(() => { });

    comp.onSignupSubmit();
    expect(af.auth.createUser).toHaveBeenCalled();
    setTimeout(function() { //since the prior method is async call
            expect(spy).toHaveBeenCalled();
        },1000);
  }));

  it('Mode: forgotPassword',
    inject([
      AngularFire, MatDialogRef
    ],
    (af: AngularFire, dRef: MatDialogRef<PasswordAuthComponent>) => {

    comp.mode = SignInMode.forgotPassword;
    fixture.detectChanges();

    let deForm = fixture.debugElement.query(By.css('form'));
    let deFormButton = deForm.query(By.css('button[type="submit"]'));
    
    ///"sign-in-form"
    expect(deFormButton.nativeElement.textContent).toContain("FORGOT PASSWORD");

    let form = comp.forgotPasswordForm;
    expect(form.valid).toEqual(false);

    form.get('email').setValue("test");
    expect(form.get('email').valid).toEqual(false);
    form.get('email').setValue("test@abc.com");
    expect(form.get('email').valid).toEqual(true);

    expect(form.valid).toEqual(true);

    spyOn(firebase, 'auth')
        .and.returnValue({ "sendPasswordResetEmail": (email: string) => Promise.resolve() });

    comp.onForgotPasswordSubmit();
    expect(firebase.auth).toHaveBeenCalled();
  }));

});
