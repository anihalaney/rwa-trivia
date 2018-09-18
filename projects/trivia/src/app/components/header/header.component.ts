import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../../../shared-library/src/lib/shared/model';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }


  navigateUrl() {
    this.router.navigate(['my/profile', this.user.userId]);
  }

  ngOnDestroy() {
  }

}
