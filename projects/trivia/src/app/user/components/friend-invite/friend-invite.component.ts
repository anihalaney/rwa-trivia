import { Component, OnInit, Input } from '@angular/core';
import { User, Invitation, friendInvitationConstants } from 'shared-library/shared/model';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../store';
import * as userActions from '../../../user/store/actions';

@Component({
  selector: 'app-friend-invite',
  templateUrl: './friend-invite.component.html',
  styleUrls: ['./friend-invite.component.scss']
})
export class FriendInviteComponent implements OnInit {
  @Input() userDict: { [key: string]: User } = {};
  @Input() invitation: Invitation;
  @Input() user: User;

  constructor(private store: Store<AppState>, private utils: Utils) {
  }

  ngOnInit() {
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 44, 40, '44X40');
  }

  acceptFriendInvitation(): void {
    this.store.dispatch(new userActions.MakeFriend({ token: this.invitation.id, email: this.user.email, userId: this.user.userId }));
  }

  rejectFriendInvitation(): void {
    this.invitation.status = friendInvitationConstants.REJECTED;
    this.store.dispatch(new userActions.UpdateInvitation(this.invitation));
  }


}
