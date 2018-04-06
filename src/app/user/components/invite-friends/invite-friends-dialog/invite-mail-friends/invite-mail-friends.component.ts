import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { User } from '../../../../../model';

@Component({
  selector: 'app-invite-mail-friends',
  templateUrl: './invite-mail-friends.component.html',
  styleUrls: ['./invite-mail-friends.component.scss']
})
export class InviteMailFriendsComponent implements OnInit {
  @Input() user: User;
  invitationForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  // create the form
  createForm() {
    this.invitationForm = this.fb.group({
      email: '',

    });
  }

}
