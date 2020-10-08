import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { UserActions } from 'shared-library/core/store/actions';
import { InviteFriends } from './invite-friends';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page/page';
import { FirebaseScreenNameConstants } from 'shared-library/shared/model';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.scss']
})
export class InviteFriendsComponent extends InviteFriends implements OnInit, OnDestroy {

  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;

  constructor(public store: Store<AppState>, public userActions: UserActions,
    private page: Page, public cd: ChangeDetectorRef) {
    super(store, userActions, cd);
  }

  ngOnInit() {
    this.page.on('loaded', () => { this.renderView = true; this.cd.markForCheck(); });
  }

  ngOnDestroy() {
    this.renderView = false;
    this.page.off('loaded');
  }
}
