import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { User, DashboardConstants } from 'shared-library/shared/model';
import { WindowRef } from 'shared-library/core/services';
import { CONFIG, projectDetail } from 'shared-library/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Output() logoutClicked = new EventEmitter();
  @Output() loginClicked = new EventEmitter();
  blogUrl = projectDetail.blogUrl;
  hostname: string;
  playstoreUrl =  CONFIG.firebaseConfig.googlePlayUrl;
  appStoreUrl = CONFIG.firebaseConfig.iTunesUrl;
  constructor(private router: Router, private windowRef: WindowRef) {
    this.hostname = `${windowRef.nativeWindow.location.protocol}//${windowRef.nativeWindow.location.hostname}/${DashboardConstants.ADMIN_ROUTE}`;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
