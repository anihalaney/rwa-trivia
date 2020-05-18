import { Component, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { User, ApplicationSettings } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState } from '../../store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { coreState } from 'shared-library/core/store';
import { projectMeta } from 'shared-library/environments/environment';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class SideNavComponent implements OnDestroy {
  @Input() user: User;
  userDict$: Observable<{ [key: string]: User }>;
  userDict: { [key: string]: User } = {};
  blogUrl = projectMeta.blogUrl;
  playstoreUrl =  projectMeta.playStoreUrl;
  appstoreUrl = projectMeta.appStoreUrl;
  subscriptions = [];
  applicationSettings: ApplicationSettings;

  constructor(private store: Store<AppState>, private router: Router, private utils: Utils) {
    this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
    this.subscriptions.push(this.userDict$.subscribe(userDict => this.userDict = userDict));
    this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.applicationSettings)).subscribe(appSettings => {
      if (appSettings) {
        this.applicationSettings = appSettings[0];
      }
    }));
  }

  ngOnDestroy() {

  }
}
