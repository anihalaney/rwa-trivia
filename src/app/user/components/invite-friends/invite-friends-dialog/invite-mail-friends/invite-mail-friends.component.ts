import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { User, Invitations } from '../../../../../model';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../../../store';
import * as userActions from '../../../../../user/store/actions';
import { userState } from '../../../../../user/store';

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-invite-mail-friends',
  templateUrl: './invite-mail-friends.component.html',
  styleUrls: ['./invite-mail-friends.component.scss']
})
export class InviteMailFriendsComponent implements OnInit {
  @Input() user: User;
  invitationForm: FormGroup;
  showErrorMsg = false;
  invalidEmailList = [];
  errorMsg = '';
  showSuccessMsg = undefined;

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.store.select(appState.coreState).select(s => s.user).subscribe(user => {
      this.user = user;
      if (user) {
        this.user = user;
      }
    });

    this.store.select(userState).select(s => s.userProfileSaveStatus).subscribe(status => {

      if (status === 'SUCCESS') {
        this.showSuccessMsg = 'Your Invitations are send Successfully!!';
      }
    });

  }

  ngOnInit() {
    this.invitationForm = this.fb.group({
      email: ['', Validators.compose([Validators.required])]
    });
  }

  isValid(email) {
    return EMAIL_REGEXP.test(String(email).toLowerCase());
  }


  onSubscribe() {
    if (!this.invitationForm.valid) {
      return;
    } else {
      let invalid = false;
      this.errorMsg = '';
      this.showErrorMsg = false;
      this.invalidEmailList = [];
      this.showSuccessMsg = undefined;

      if (this.invitationForm.get('email').value.indexOf(',') > -1) {
        const emails = this.invitationForm.get('email').value.split(',');
        for (const e of emails) {
          invalid = this.isValid(e);
          if (!invalid) {
            this.invalidEmailList.push(e);
          }
        }
        if (this.invalidEmailList.length > 0) {
          this.errorMsg = 'Following emails are not valid address!';
          this.showErrorMsg = true;
        }
      } else {
        const email = this.invitationForm.get('email').value.split(',');
        if (email === '' || !this.isValid(email)) {
          invalid = true;
          this.invalidEmailList.push(email);
          this.errorMsg = 'Following email is not valid address!';
          this.showErrorMsg = true;
        }
      }
      if (this.invalidEmailList.length === 0) {
        const invitation = new Invitations();
        invitation.created_uid = this.user.userId;
        invitation.emails = this.invitationForm.get('email').value;
        invitation.status = 'pending';
        this.store.dispatch(new userActions.AddUserInvitation({ invitation }));
      }
    }
  }
}

