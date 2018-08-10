import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { AppState, appState } from '../../../store';
import { User, Subscription } from '../../../../../../model';
import * as socialActions from '../../../social/store/actions';
import { socialState } from '../../store';

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  subscriptionForm: FormGroup;
  user: User;
  isSubscribed: Boolean = false;
  totalCount: Number = 0;
  message = '';

  constructor(private fb: FormBuilder, private store: Store<AppState>, ) {
    this.subscriptionForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])]
    });
    this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {

      this.user = user;
      if (user) {
        this.user = user;
        this.subscriptionForm = this.fb.group({
          email: [this.user.email]
        });
        if (!this.user.isSubscribed) {
          this.message = '';
          this.isSubscribed = false;
        }
      }
    });
    this.store.select(socialState).pipe(select(s => s.checkEmailSubscriptionStatus)).subscribe(status => {

      if (status === true) {
        this.isSubscribed = true;
        this.message = 'This EmailId is already Subscribed!!';
      } else if (status === false) {
        this.isSubscribed = true;
        this.store.dispatch(new socialActions.GetTotalSubscriber());
        this.message = 'Your EmailId is Successfully Subscribed!!';
      }
    });
    this.store.select(socialState).pipe(select(s => s.getTotalSubscriptionStatus)).subscribe(subscribers => {
      this.totalCount = subscribers['count'];
    });
  }

  ngOnInit() {

    this.store.dispatch(new socialActions.GetTotalSubscriber());
  }

  onSubscribe() {
    if (!this.subscriptionForm.valid) {
      return;
    } else {
      const subscription = new Subscription();
      subscription.email = this.subscriptionForm.get('email').value;
      if (this.user) {
        subscription.userId = this.user.userId;
      }
      this.store.dispatch(new socialActions.AddSubscriber({ subscription }));
    }
  }
}
