import { Component, ChangeDetectionStrategy, OnDestroy, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { UserActions, coreState } from 'shared-library/core/store';
import { AppState, appState } from './../../../../../../../trivia/src/app/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { isAndroid } from 'tns-core-modules/platform';
import { MobUtils } from '../../../../core/services/mobile';

@Component({
  selector: 'user-feedback',
  templateUrl: './user-feedback.component.html',
  styleUrls: ['./user-feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class UserFeedbackComponent implements OnDestroy {
  subscriptions = [];
  feedbackForm: FormGroup;
  user: any;
  feedbacklength = { min: 15 , max: 200};
  @ViewChildren('textField') textField: QueryList<ElementRef>;
  email_regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private page: Page, private fb: FormBuilder, private store: Store<AppState>, private userAction: UserActions,
     private cd: ChangeDetectorRef, private utils: MobUtils) {

    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.feedback)).subscribe(status => {
      if (status === 'SUCCESS') {
        this.resetForm();
        this.cd.markForCheck();
        this.utils.showMessage('success', 'Feedback sent successfully');
      }
    }));

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
        this.user = user;
        this.cd.markForCheck();
    }));


    this.initForm();
  }

  initForm() {
      this.feedbackForm = this.fb.group({
        email: [ (this.user && this.user.email) ? this.user.email : '', [Validators.required,  Validators.pattern(this.email_regexp)]],
        feedback: ['', [Validators.required,  Validators.minLength(this.feedbacklength.min) ,
          Validators.maxLength(this.feedbacklength.max)]]
    });
  }

  resetForm() {
    this.feedbackForm.controls['feedback'].reset();
  }

  onSubmit() {
    this.hideKeyboard();
    if (!this.feedbackForm.valid) {
      return;
    }
    let body;
    if (this.user) {
        body = {...this.feedbackForm.value, user_id:  this.user.userId };
    } else {
      body = {...this.feedbackForm.value };

    }
    this.store.dispatch(this.userAction.addFeedback(body));
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

  ngOnDestroy() {

  }

}
