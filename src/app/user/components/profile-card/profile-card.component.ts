import { Component, Input } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary, getCategories, getTags } from '../../../store';
import { userState } from '../../../user/store';
import { Observable } from 'rxjs/Observable';
import * as userActions from '../../store/actions';


import { User } from '../../../model';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnChanges {
  @Input() user: User;
  profileImage: { image: any } = { image: '/assets/images/avatar.png' };
  basePath = '/profile';
  profileImagePath = 'avatar';
  userObs: Observable<User>;

  constructor(private storage: AngularFireStorage, private store: Store<AppState>) {


  }

  ngOnChanges() {
    if (this.user) {
      this.store.dispatch(new userActions.LoadUserProfile({ user: this.user }));
      this.userObs = this.store.select(userState).select(s => s.user);
      this.userObs.subscribe(user => {
        if (user) {
          if (user.name) {
            this.user = user;
          } else {
            this.user.roles = user.roles;
          }

          if (this.user.profilePicture && this.user.name === user.name) {
            const filePath = `${this.basePath}/${this.user.userId}/${this.profileImagePath}/${this.user.profilePicture}`;
            const ref = this.storage.ref(filePath);
            ref.getDownloadURL().subscribe(res => {
              this.profileImage.image = res;
            });
          }
        }
      });
    }

  }
}
