import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { User, Invitation, friendInvitationConstants } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { Store } from '@ngrx/store';
// import { AppState, appState } from '../../../store';
// import * as userActions from '../../../user/store/actions';
import { AppState, appState } from '../../store';
import { UserActions } from 'shared-library/core/store/actions';


@Component({
  selector: 'app-friend-invite',
  templateUrl: './friend-invite.component.html',
  styleUrls: ['./friend-invite.component.scss']
})
export class FriendInviteComponent implements OnInit {
  @Input() userDict: { [key: string]: User } = {};
  @Input() invitation: Invitation;
  invitations: Invitation[];
  @Input() user: User;

  constructor(private store: Store<AppState>,
    private utils: Utils,
    private userActions: UserActions,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  getImageUrl(user: User) {
    return this.utils.getImageUrl(user, 44, 40, '44X40');
  }

  acceptFriendInvitation(): void {
    this.store.dispatch(this.userActions.makeFriend({ token: this.invitation.id, email: this.user.email, userId: this.user.userId }));
  }

  rejectFriendInvitation(): void {
    this.invitation.status = friendInvitationConstants.REJECTED;
    this.store.dispatch(this.userActions.updateInvitation(this.invitation));
    this.cd.detectChanges();
  }

}
