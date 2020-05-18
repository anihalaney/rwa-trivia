import { Component, ChangeDetectionStrategy, OnDestroy, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { UserActions, coreState } from 'shared-library/core/store';
import { AppState, appState } from './../../../../../../../trivia/src/app/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { isIOS } from 'tns-core-modules/platform';
import { Utils } from 'shared-library/core/services';
declare var IQKeyboardManager;
@Component({
  selector: 'user-feedback',
  templateUrl: './user-feedback.component.html',
  styleUrls: ['./user-feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class UserFeedbackComponent implements OnDestroy, OnInit {
  iqKeyboard: any;
  subscriptions = [];
  feedbackForm: FormGroup;
  user: any;
  feedbacklength = { min: 15, max: 200 };
  @ViewChildren('textField') textField: QueryList<ElementRef>;
  email_regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  renderView = false;
  constructor(private page: Page, private fb: FormBuilder, private store: Store<AppState>, private userAction: UserActions,
    private cd: ChangeDetectorRef, private utils: Utils) {

    if (isIOS) {
      this.iqKeyboard = IQKeyboardManager.sharedManager();
      this.iqKeyboard.shouldResignOnTouchOutside = true;
    }
  }

  ngOnInit(): void {
    this.page.on('loaded', () => { this.renderView = true; this.cd.markForCheck(); });
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.feedback)).subscribe(status => {
      if (status === 'SUCCESS') {
        this.resetForm();
        this.cd.markForCheck();
        this.utils.showMessage('success', 'Feedback sent successfully');
      }
    }));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
      this.initForm();
      this.cd.markForCheck();
    }));
  }

  initForm() {
    this.feedbackForm = this.fb.group({
      email: [(this.user && this.user.email) ? this.user.email : '', [Validators.required, Validators.pattern(this.email_regexp)]],
      feedback: ['', [Validators.required, Validators.minLength(this.feedbacklength.min),
      Validators.maxLength(this.feedbacklength.max)]]
    });
  }

  resetForm() {
    this.feedbackForm.controls['feedback'].reset();
    if (!(this.user && this.user.email)) {
      this.feedbackForm.controls['email'].reset();
    }
  }

  onSubmit() {
    this.hideKeyboard();
    if (!this.feedbackForm.valid) {
      this.utils.showMessage('error', 'Please Fill the details');
      return;
    }
    let body;
    if (this.user) {
      body = { ...this.feedbackForm.value, user_id: this.user.userId };
    } else {
      body = { ...this.feedbackForm.value };

    }
    this.store.dispatch(this.userAction.addFeedback(body));
  }

  hideKeyboard() {
    this.utils.hideKeyboard(this.textField);
  }

  ngOnDestroy() {
    this.page.off('loaded');
    this.renderView = false;
  }

}
