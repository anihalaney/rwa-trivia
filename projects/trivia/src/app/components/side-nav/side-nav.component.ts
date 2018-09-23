import { Component, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { User } from '../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../shared-library/src/lib/core/services';
import { AppState, appState } from '../../store';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent implements OnDestroy {
  @Input() user: User;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  subs: Subscription[] = [];
  blogUrl = 'https://bitwiser.io';

  constructor(private store: Store<AppState>, private router: Router) {
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));
  }
  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
  navigateUrl() {
    this.router.navigate(['my/questions']);
  }
}
