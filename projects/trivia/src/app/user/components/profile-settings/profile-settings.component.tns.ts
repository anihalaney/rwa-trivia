import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { userState } from '../../../user/store';
import { ProfileSettings } from './profile-settings';
import { Utils } from 'shared-library/core/services';
import { profileSettingsConstants } from 'shared-library/shared/model';

@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})

export class ProfileSettingsComponent extends ProfileSettings implements OnDestroy {

  // Properties

  constructor(public fb: FormBuilder,
    public store: Store<AppState>,
    public utils: Utils) {

    super(fb, store, utils);

    this.subs.push(this.store.select(userState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {
      if (status === 'SUCCESS') {
      }
    }));
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

}
