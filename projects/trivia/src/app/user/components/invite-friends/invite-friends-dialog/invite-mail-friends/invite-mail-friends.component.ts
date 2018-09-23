import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';

import { User } from '../../../../../../../../shared-library/src/lib/shared/model';
import { AppState, appState } from '../../../../../store';
import * as userActions from '../../../../../user/store/actions';
import { userState } from '../../../../../user/store';

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-invite-mail-friends',
  templateUrl: './invite-mail-friends.component.html',
  styleUrls: ['./invite-mail-friends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteMailFriendsComponent implements OnInit {
  @Input() user: User;
  invitationForm: FormGroup;
  showErrorMsg = false;
  invalidEmailList = [];
  errorMsg = '';
  showSuccessMsg = undefined;
  validEmail = [];

  constructor(private fb: FormBuilder, private store: Store<AppState>) {
    this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      this.user = user;
      if (user) {
        this.user = user;
      }
    });

    this.store.select(userState).pipe(select(s => s.userProfileSaveStatus)).subscribe(status => {

      if (status === 'INVITATION SUCCESS') {
        this.showSuccessMsg = 'Your Invitations are send Successfully!!';
      }
    });

  }

  ngOnInit() {
    this.showSuccessMsg = undefined;
    this.invitationForm = this.fb.group({
      email: ['', Validators.required]
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
      this.validEmail = [];

      if (this.invitationForm.get('email').value.indexOf(',') > -1) {
        const emails = this.invitationForm.get('email').value.split(',');
        for (const e of emails) {
          invalid = this.isValid(e);
          if (!invalid) {
            this.invalidEmailList.push(e);
          } else {
            this.validEmail.push(e);
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
        } else {
          this.validEmail.push(this.invitationForm.get('email').value);
        }

      }
      if (this.invalidEmailList.length === 0) {
        this.store.dispatch(new userActions.AddUserInvitation(
          { created_uid: this.user.userId, emails: this.validEmail, status: 'pending' }));
      }
    }
  }
}

