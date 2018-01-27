import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../core/store/app-store';
import { User } from '../../model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Output() logoutClicked = new EventEmitter();
  @Output() loginClicked = new EventEmitter();
  @Output() toggleThemeClicked = new EventEmitter();
  
  constructor(private store: Store<AppStore>,
              private router: Router) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
