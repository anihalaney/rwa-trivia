import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { openUrl } from 'tns-core-modules/utils/utils';
import { Utils } from 'shared-library/core/services';
import { FirebaseScreenNameConstants } from 'shared-library/shared/model';

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class PrivacyPolicyComponent {

  constructor(
    private page: Page,
    private utils: Utils
    ) {
  }

  openUrl(url: any) {
    openUrl(url);
  }


}
