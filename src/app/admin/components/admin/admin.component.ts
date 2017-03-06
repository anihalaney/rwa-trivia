import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../../core/store/app-store';
import { User } from '../../../model';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  user: User;
  sub: any;

  constructor(private store: Store<AppStore>,
              private router: Router) {
    this.sub = store.select(s => s.user).subscribe(user => {
      if (!user || !user.roles["admin"])
        this.router.navigate(['/']);

      this.user = user
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe();
  }
}
