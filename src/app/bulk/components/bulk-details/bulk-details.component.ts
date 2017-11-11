import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../../core/store/app-store';
import { User } from '../../../model';

@Component({
  selector: 'bulk-details',
  templateUrl: './bulk-details.component.html',
  styleUrls: ['./bulk-details.component.scss']
})
export class BulkDetailsComponent implements OnInit, OnDestroy {

  constructor(private store: Store<AppStore>,
              private router: Router) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
