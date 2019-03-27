import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import * as utilsModule from 'tns-core-modules/utils/utils';

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})


export class PrivacyPolicyComponent implements OnInit {

  constructor(private page: Page) {
  }

  openUrl(url: any) {
    utilsModule.openUrl(url);
  }

  ngOnInit() {
  }
}
