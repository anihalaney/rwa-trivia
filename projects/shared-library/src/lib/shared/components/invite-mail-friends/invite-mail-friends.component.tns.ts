import {
    Component, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Store } from '@ngrx/store';
import { CoreState, UserActions } from 'shared-library/core/store';
import { Utils } from 'shared-library/core/services';
import { InviteMailFriends } from './invite-mail-friends';
import { isAndroid, isIOS } from 'tns-core-modules/ui/page';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
declare var IQKeyboardManager;
@Component({
    selector: 'app-invite-mail-friends',
    templateUrl: './invite-mail-friends.component.html',
    styleUrls: ['./invite-mail-friends.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InviteMailFriendsComponent extends InviteMailFriends {
    iqKeyboard: any;
    constructor(fb: FormBuilder, store: Store<CoreState>, userAction: UserActions, cd: ChangeDetectorRef,
        utils: Utils) {
        super(fb, store, userAction, cd, utils);

        if (isIOS) {
            this.iqKeyboard = IQKeyboardManager.sharedManager();
            this.iqKeyboard.shouldResignOnTouchOutside = true;
          }
    }

    hideKeyboard() {
        if (isAndroid) {
          this.textField
            .toArray()
            .map((el) => {
              if (el.nativeElement) {
                el.nativeElement.android.clearFocus();
                return el.nativeElement.dismissSoftInput();
              }
            });
        }
      }
}
