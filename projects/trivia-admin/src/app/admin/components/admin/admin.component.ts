import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { AppState, appState } from '../../../store';
import { User } from '../../../../../../shared-library/src/lib/shared/model';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  user: User;
  sub: any;

  constructor(private store: Store<AppState>,
    private router: Router) {
    this.sub = store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
      if (!user || !user.roles['admin']) {
        this.router.navigate(['/']);

      }

      this.user = user
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }

  }
}
