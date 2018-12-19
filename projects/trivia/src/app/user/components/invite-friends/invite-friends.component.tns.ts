import { Component } from '@angular/core';
import { Utils } from 'shared-library/core/services';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { UserActions } from 'shared-library/core/store/actions';
import { InviteFriends } from './invite-friends';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.scss']
})
export class InviteFriendsComponent extends InviteFriends {
  constructor(public store: Store<AppState>, public userActions: UserActions, public utils: Utils,
    private routerExtension: RouterExtensions) {
    super(store, userActions, utils);
  }

  navigateToInvite() {
    this.routerExtension.navigate(['my/app-invite-friends-dialog']);
  }
}
