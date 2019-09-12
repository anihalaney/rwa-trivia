import {
    Component, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Store } from '@ngrx/store';
import { CoreState, UserActions } from 'shared-library/core/store';
import { Utils } from 'shared-library/core/services';
import { InviteMailFriends } from './invite-mail-friends';
import { isIOS } from 'tns-core-modules/ui/page';
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
          this.utils.hideKeyboard(this.textField);
      }
}
