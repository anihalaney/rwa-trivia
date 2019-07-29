import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { User, Invitation, friendInvitationConstants, userCardType } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { Store } from '@ngrx/store';
import { UserActions } from 'shared-library/core/store/actions';
import { AppState } from '../../../store';


@Component({
  selector: 'app-friend-invite',
  templateUrl: './friend-invite.component.html',
  styleUrls: ['./friend-invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendInviteComponent implements OnInit {
  @Input() invitation: Invitation;
  invitations: Invitation[];
  @Input() user: User;
  userCardType = userCardType;

  constructor(private store: Store<AppState>,
    private utils: Utils,
    private userActions: UserActions,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  acceptFriendInvitation(): void {
    this.store.dispatch(this.userActions.makeFriend({ token: this.invitation.id, email: this.user.email, userId: this.user.userId }));
  }

  rejectFriendInvitation(): void {
    this.invitation.status = friendInvitationConstants.REJECTED;
    this.store.dispatch(this.userActions.updateInvitation(this.invitation));
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

}
