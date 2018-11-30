import { Component, OnInit, OnDestroy } from '@angular/core';
import { Utils } from 'shared-library/core/services';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { UserActions } from 'shared-library/core/store/actions';
import { InviteFriends } from './invite-friends';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.scss']
})
export class InviteFriendsComponent extends InviteFriends implements OnInit, OnDestroy {
  constructor(public store: Store<AppState>, public userActions: UserActions, public utils: Utils) {
    super(store, userActions, utils);
  }
}
