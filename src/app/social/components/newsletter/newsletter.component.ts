import { Component, OnInit, Input, } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary, getCategories, getTags } from '../../../store';
import { User, Subscription } from '../../../model';
import * as socialActions from '../../../social/store/actions';
import { Observable } from 'rxjs/Observable';
import { userState } from '../../../user/store';
import { socialState } from '../../store';

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

  constructor(private fb: FormBuilder, private store: Store<AppState>, ) {
    store.select(appState.coreState).select(s => s.user).subscribe(user => {
      this.user = user
      if (user) {
        this.user = user;
      }
    });
    this.store.select(socialState).select(s => s.subscriptionSaveStatus).subscribe(status => {
      if (status === 'SUCCESS') {
        this.isSubscribed = true;
      }
    });
  }

  ngOnInit() {
    this.subscriptionForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])]
    }
    );
  }

  onSubscribe() {
    if (!this.subscriptionForm.valid) {
      return;
    } else {
      this.store.dispatch(new socialActions.AddSubscriber(
        { subscription: new Subscription(this.subscriptionForm.get('email').value, this.user.userId) }));


    }
  }
}
