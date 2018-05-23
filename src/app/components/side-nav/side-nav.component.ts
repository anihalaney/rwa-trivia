import { Component, Input, OnDestroy } from '@angular/core';
import { User } from '../../model';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../store';
import { Subscription } from 'rxjs/Subscription';
import { Utils } from '../../core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnDestroy {
  @Input() user: User;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  subs: Subscription[] = [];

  constructor(private store: Store<AppState>, private router: Router) {
    this.userDict$ = store.select(appState.coreState).select(s => s.userDict);
    this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));
  }
  ngOnDestroy() {
    Utils.unsubscribe(this.subs);
  }
  navigateUrl() {
    this.router.navigate(['my/questions', this.user.userId]);
  }
}
