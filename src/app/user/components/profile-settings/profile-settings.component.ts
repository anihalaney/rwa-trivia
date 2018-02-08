import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';

import {AppStore} from '../../../core/store/app-store';
import {User} from '../../../model';
import {UserService} from "../../../core/services/user.service";
import {Observable} from "rxjs/Observable";
import {UserActions} from "../../../core/store/actions/user.actions";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  @Input() user: User;

  userObs: Observable<User[]>;
  users: User[];
  sub: Subscription;
  userForm: FormGroup;

  constructor(private store: Store<AppStore>,
              private userAction: UserActions,
              private fb: FormBuilder) {

    this.userObs = store.select(s => s.users)
    this.sub = store.select(s => s.user).subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.sub = this.userObs.subscribe(users => this.users = users);
    console.log(this.users);
    this.userForm = this.fb.group({
      name:[this.user.name],
      displayName:[this.user.displayName],
      location:[this.user.location],
      facebook:[this.user.social.length > 0 ? this.user.social[0] : ''],
      twitter:[this.user.social.length > 0 ? this.user.social[0] : ''],
      linkedin:[this.user.social.length > 0 ? this.user.social[0] : ''],
    });
  }

  save = function () {
    alert('Saved');
    this.store.dispatch(this.userAction.updateUser(this.user));
    //this.userService.saveUser(this.user);
  }

  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe();
  }
}
