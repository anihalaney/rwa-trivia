import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UserReaction } from './user-reaction';
import { Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { AppState } from './../../../../../../trivia/src/app/store';
import { GameActions } from 'shared-library/core/store/actions';
import { AuthenticationProvider } from 'shared-library/core/auth';
@Component({
  selector: 'user-reaction',
  templateUrl: './user-reaction.component.html',
  styleUrls: ['./user-reaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class UserReactionComponent extends UserReaction implements OnDestroy {
  subscriptions: Subscription[] = [];
  constructor(public store: Store<AppState>, public cd: ChangeDetectorRef, public gameActions: GameActions,
    public authService: AuthenticationProvider) {
    super(store, cd, gameActions, authService);
  }

  ngOnDestroy() {

  }
}
