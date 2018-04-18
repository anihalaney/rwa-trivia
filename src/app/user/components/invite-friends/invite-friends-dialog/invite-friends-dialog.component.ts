import { Component, OnInit } from '@angular/core';
import { User } from '../../../../model';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../../../store';
import { Location } from '@angular/common';



@Component({
  selector: 'app-invite-friends-dialog',
  templateUrl: './invite-friends-dialog.component.html',
  styleUrls: ['./invite-friends-dialog.component.scss']
})
export class InviteFriendsDialogComponent implements OnInit {

  user: User;
  navLinks = [];

  constructor(private store: Store<AppState>, private location: Location) {
    this.store.select(appState.coreState).take(1).subscribe(s => this.user = s.user);

  }

  ngOnInit() {

  }

  closeModel() {
    this.location.back();
  }
}
