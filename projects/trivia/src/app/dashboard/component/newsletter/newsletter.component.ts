import { PLATFORM_ID, APP_ID, Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { User, Subscription } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import * as dashboardActions from '../../store/actions';
import { dashboardState } from '../../store';
import { isPlatformBrowser } from '@angular/common';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class NewsletterComponent implements OnInit, OnDestroy {

  subscriptionForm: FormGroup;
  user: User;
  isSubscribed: Boolean = false;
  totalCount: Number = 0;
  message = '';
  subscriptions = [];

  constructor(private fb: FormBuilder, private store: Store<AppState>,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string, private cd: ChangeDetectorRef) {
    this.subscriptionForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])]
    });

    this.subscriptions.push(this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {

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
    }));
    this.subscriptions.push(this.store.select(dashboardState).pipe(select(s => s.checkEmailSubscriptionStatus)).subscribe(status => {
      if (status === true) {
        this.isSubscribed = true;
        this.message = 'This EmailId is already Subscribed!!';
      } else if (status === false) {
        this.isSubscribed = true;
        this.store.dispatch(new dashboardActions.GetTotalSubscriber());
        this.message = 'Your EmailId is Successfully Subscribed!!';
      }
    }));
    this.subscriptions.push(this.store.select(dashboardState).pipe(select(s => s.getTotalSubscriptionStatus)).subscribe(subscribers => {
      if (subscribers) {
        this.totalCount = subscribers['count'];
        this.cd.markForCheck();
      }
    }));
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new dashboardActions.GetTotalSubscriber());
    }
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
      this.store.dispatch(new dashboardActions.AddSubscriber({ subscription }));
    }
  }

  ngOnDestroy(): void {

  }
}
