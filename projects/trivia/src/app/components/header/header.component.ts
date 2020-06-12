import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { User } from 'shared-library/shared/model';
import { projectMeta } from 'shared-library/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Output() logoutClicked = new EventEmitter();
  @Output() loginClicked = new EventEmitter();
  @Output() toggleThemeClicked = new EventEmitter();
  projectMeta = projectMeta;

  constructor(public router: Router) { }

  ngOnInit() {
  }


  navigateUrl() {
    this.router.navigate(['user/my/profile', this.user.userId]);
  }

  ngOnDestroy() {
  }

}
