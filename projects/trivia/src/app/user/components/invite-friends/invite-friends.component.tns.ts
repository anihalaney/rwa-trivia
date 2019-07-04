import { Component, ChangeDetectionStrategy, OnInit, NgZone, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Utils } from 'shared-library/core/services';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { UserActions } from 'shared-library/core/store/actions';
import { InviteFriends } from './invite-friends';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.scss']
})
export class InviteFriendsComponent extends InviteFriends implements OnInit, OnDestroy {

  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;

  constructor(public store: Store<AppState>, public userActions: UserActions, public utils: Utils,
    private routerExtension: RouterExtensions, private page: Page, private ngZone: NgZone, public cd: ChangeDetectorRef) {
    super(store, userActions, utils, cd);
  }

  ngOnInit() {
    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => this.renderView = true));
  }
  navigateToInvite() {
    this.routerExtension.navigate(['user/my/app-invite-friends-dialog']);
  }
  ngOnDestroy() {
    this.page.off('loaded');
  }
}
