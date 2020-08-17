import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { User, DashboardConstants } from 'shared-library/shared/model';
import { WindowRef } from 'shared-library/core/services';
import { projectMeta } from 'shared-library/environments/environment';
import { isPlatformBrowser } from '@angular/common';

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
  blogUrl = projectMeta.blogUrl;
  hostname: string;
  playstoreUrl = projectMeta.playStoreUrl;
  appStoreUrl = projectMeta.appStoreUrl;
  constructor(private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    public windowRef: WindowRef) {
    if (isPlatformBrowser(this.platformId)) {
      this.hostname = `${windowRef.nativeWindow.location.protocol}//${windowRef.nativeWindow.location.hostname}/${DashboardConstants.ADMIN_ROUTE}`;
    }

  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
