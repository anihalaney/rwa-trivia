import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, } from '@angular/core';
import { Router } from '@angular/router';

import { User, DashboardConstants } from 'shared-library/shared/model';
import { WindowRef } from 'shared-library/core/services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Output() logoutClicked = new EventEmitter();
  @Output() loginClicked = new EventEmitter();
  blogUrl = 'https://bitwiser.io';
  hostname: string;

  constructor(private router: Router, private windowRef: WindowRef) {
    this.hostname = `${windowRef.nativeWindow.location.protocol}//${windowRef.nativeWindow.location.hostname}/${DashboardConstants.ADMIN_ROUTE}`;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
