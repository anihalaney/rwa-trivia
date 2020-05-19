import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { User } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { OnDestroy } from '@angular/core';

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class Game implements OnDestroy {
  user: User;

  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  subscriptions = [];

  constructor(public store: Store<AppState>) {

    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => this.userDict = userDict));
    this.subscriptions.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user));
  }

  ngOnDestroy() {

  }
}
