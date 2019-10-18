import { Component, OnInit, Renderer2, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { User } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../../../store';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invite-friends-dialog',
  templateUrl: './invite-friends-dialog.component.html',
  styleUrls: ['./invite-friends-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class InviteFriendsDialogComponent implements OnInit, OnDestroy {
  user: User;
  navLinks = [];
  ref: any;
  subscriptions = [];
  showSkipBtn: boolean;
  constructor(private store: Store<AppState>, private renderer: Renderer2, private utils: Utils, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user));

    this.route.params.subscribe((params) => {
      const boolValue = (params.showSkip === 'true' ? true : false);
      this.showSkipBtn = boolValue;
    });
  }

  closeModel() {
    this.ref.close();
  }

  ngOnDestroy() {

  }
}
