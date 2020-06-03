import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowHintWhenFocusOutDirective } from './show-hint-when-focus-out.directive';
import { Component, DebugElement } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSnackBarModule, MatInputModule } from '@angular/material';
import { Utils } from '../../core/services';

@Component({
  template: `
  <form (ngSubmit)="onSubmit()" class="sign-in-form" [formGroup]="loginForm" novalidate>
    <mat-form-field class="
    full-width required">
      <input [stlShowHintWhenFocusOut]="{hintRef: emailHint, controlRef:loginForm.controls.email, removeClass: 'error'}"
        matInput placeholder="Email *" formControlName="email" class="required" aria-label="email" id="email">
        <mat-hint  #emailHint align="end" class="error">Invalid Email! </mat-hint>
    </mat-form-field>
  </form>
  `
})

class TestComponent {

  loginForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  email_regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(public fb: FormBuilder) {

    this.loginForm = this.fb.group({
      email: new FormControl('', { validators: [Validators.required, Validators.pattern(this.email_regexp)] }),
    }
    );
  }
}

describe('ShowHintWhenFocusOutDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        ShowHintWhenFocusOutDirective
      ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        Utils
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });
  it('When form field is empty then it should not show error', () => {
    const firstNameValidationError = fixture.debugElement.query(By.css('.mat-hint'));
    expect(firstNameValidationError.nativeElement.style.visibility).toBe('collapsed');
  });

  it('When user input invalid data into field and did not remove focus from field then it should not display error', () => {

    component.loginForm.get('email').setValue('demo');
    fixture.detectChanges();
    const firstNameValidationError = fixture.debugElement.query(By.css('.mat-hint'));
    expect(firstNameValidationError.nativeElement.style.visibility).toBe('collapsed');
  });

  it('When user input invalid data into field and remove focus from field then it should show error', () => {

    const input = debugElement.query(By.css('#email'));
    const inputElement = input.nativeElement;
    component.loginForm.get('email').setValue('demo');
    fixture.detectChanges();
    inputElement.dispatchEvent(new Event('blur'));
    const firstNameValidationError = fixture.debugElement.query(By.css('.mat-hint'));
    expect(firstNameValidationError.nativeElement.style.visibility).toBe('visible');
  });

  it('When user input invalid data into field and remove focus and again write in invalid data then it should display error', () => {

    const input = debugElement.query(By.css('#email'));
    const inputElement = input.nativeElement;
    // Enter invalid data
    component.loginForm.get('email').setValue('demo');
    fixture.detectChanges();

    // Remove Focus from field
    inputElement.dispatchEvent(new Event('blur'));
    const firstNameValidationError = fixture.debugElement.query(By.css('.mat-hint'));

    // Display Error
    expect(firstNameValidationError.nativeElement.style.visibility).toBe('visible');

    // Insert Again Invalid data
    component.loginForm.get('email').setValue('demo@demo');

    // Display Error
    expect(firstNameValidationError.nativeElement.style.visibility).toBe('visible');

  });

  it('When user input invalid data into field and remove focus and again write valid data then it should not display error', () => {

    const input = debugElement.query(By.css('#email'));
    const inputElement = input.nativeElement;
    // Enter invalid data
    component.loginForm.get('email').setValue('demo');
    fixture.detectChanges();

    // Remove Focus from field
    inputElement.dispatchEvent(new Event('blur'));

    const firstNameValidationError = fixture.debugElement.query(By.css('.mat-hint'));
    // Display Error
    expect(firstNameValidationError.nativeElement.style.visibility).toBe('visible');

    // Insert Again valid data
    component.loginForm.get('email').setValue('demo@demo.com');

    // Should not display Error
    expect(firstNameValidationError.nativeElement.style.visibility).toBe('collapsed');

  });

});

