import {
  Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { UserProfile } from './user-profile';
import { Utils } from 'shared-library/core/services';
import { UserActions } from 'shared-library/core/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ActivatedRoute } from '@angular/router';
import { openUrl } from 'tns-core-modules/utils/utils';
@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class UserProfileComponent extends UserProfile implements OnDestroy {

  showSelectCategory = false;
  showSelectTag = false;
  subscriptions = [];

  constructor(public route: ActivatedRoute, public fb: FormBuilder,
    public store: Store<AppState>,
    public userAction: UserActions,
    public utils: Utils,
    public cd: ChangeDetectorRef) {
    super(store, userAction, utils, cd, route);

  }

  openUrl(baseUrl: string, profile: string) {
    openUrl(`${baseUrl}${profile}`);
  }

  ngOnDestroy() {
  }

}
