import { Component, Input, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { UserProfile } from './user-profile';
import { Utils } from 'shared-library/core/services';
import {  UserActions } from 'shared-library/core/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({'arrayName': 'subscriptions'})
export class UserProfileComponent extends UserProfile implements OnDestroy {

  // Properties
  subscriptions = [];

  constructor(public route: ActivatedRoute,
    public store: Store<AppState>,
    public userAction: UserActions,
    public cd: ChangeDetectorRef,
    public utils: Utils) {
    super( store, userAction, utils, cd, route);


  }

  ngOnDestroy() {

  }

}
