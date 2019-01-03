import { Component, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { User } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent implements OnDestroy {
  @Input() user: User;
  userObs: Observable<User>;
  location = 'unknown';
  userProfileImageUrl: string;
  subs: Subscription[] = [];

  constructor(private store: Store<AppState>, private router: Router, private utils: Utils) {
    this.userObs = this.store.select(appState.coreState).pipe(select(s => s.user));

    this.subs.push(this.userObs.subscribe(user => {
      if (user !== null) {
        this.user = user;
        (this.user.location) ? this.location = this.user.location : '';
        this.userProfileImageUrl = this.getImageUrl(this.user);
      }
    }));
  }

  navigateToProfile() {
    this.router.navigate(['my/profile', this.user.userId]);
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 263, 263, '400X400');
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }

}
