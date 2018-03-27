import { Component, Input, OnChanges } from '@angular/core';

import { User } from '../../../model';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary, getCategories, getTags } from '../../../store';
import * as userActions from '../../store/actions';
import { Observable } from 'rxjs/Observable';
import { userState } from '../../store';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnChanges {
  @Input() user: User;
  userObs: Observable<User>;
  profileUser: string;

  constructor(private store: Store<AppState>) {
    this.userObs = this.store.select(userState).select(s => s.user);

    this.userObs.subscribe(user => {
      if (user !== null) {
        this.user = user;
        this.profileUser = this.user.profileUrl;
      }
    });


  }

  ngOnChanges() {
    if (this.user) {
      this.store.dispatch(new userActions.LoadUserProfile({ user: this.user }));

    }
  }
}
