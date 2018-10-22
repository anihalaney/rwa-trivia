import { Component, OnInit, OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { User } from '../../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../../shared-library/src/lib/core/services';
import { AppState, appState } from '../../../store';
import * as gameplayactions from '../../store/actions';


@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  user: User;
  subs: Subscription[] = [];
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};

  constructor(private store: Store<AppState>,
    private utils: Utils) {

    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));

  }

  ngOnInit() {
    this.subs.push(this.store.select(appState.coreState).pipe(take(1)).subscribe(s => this.user = s.user));
  }

  ngOnDestroy() {
    this.utils.unsubscribe(this.subs);
  }
}
