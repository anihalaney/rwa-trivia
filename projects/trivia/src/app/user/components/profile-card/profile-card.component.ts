import { Component, Input } from '@angular/core';

import { User } from '../../../../../../shared-library/src/public_api';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState, appState } from '../../../store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utils } from '../../../core/services';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() user: User;
  userObs: Observable<User>;
  location = 'unknown';
  userProfileImageUrl: string;

  constructor(private store: Store<AppState>, private router: Router) {
    this.userObs = this.store.select(appState.coreState).pipe(select(s => s.user));

    this.userObs.subscribe(user => {
      if (user !== null) {
        this.user = user;
        (this.user.location) ? this.location = this.user.location : '';
        this.userProfileImageUrl = this.getImageUrl(this.user);
      }
    });
  }

  navigateToProfile() {
    this.router.navigate(['my/profile', this.user.userId]);
  }

  getImageUrl(user: User) {
    return Utils.getImageUrl(user, 263, 263, '400X400');
  }

}
