import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { User } from 'shared-library/shared/model';
import { AppState, appState } from '../../../store';

export class Game {
  user: User;
  subs: Subscription[] = [];

  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};

  constructor(public store: Store<AppState>) {

    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));
    this.subs.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user));

  }
}
