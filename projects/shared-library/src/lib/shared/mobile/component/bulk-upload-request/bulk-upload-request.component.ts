import { Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { CoreState, coreState, UserActions } from '../../../../core/store';
import { User, profileSettingsConstants } from 'shared-library/shared/model';
import { Utils } from '../../../../core/services';
import { NavigationService } from 'shared-library/core/services/mobile';


@Component({
    selector: 'ns-bulk-upload-request',
    moduleId: module.id,
    templateUrl: 'bulk-upload-request.component.html',
    styleUrls: ['bulk-upload-request.component.scss']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class BulkUploadRequestComponent implements OnDestroy, OnInit {

    user: User;
    subscriptions = [];
    bulkUploadBtnText: string;
    NONE = profileSettingsConstants.NONE;
    PENDING = profileSettingsConstants.PENDING;
    APPROVED = profileSettingsConstants.APPROVED;
    constructor(
        private routerExtensions: RouterExtensions,
        public store: Store<CoreState>,
        public cd: ChangeDetectorRef,
        public utils: Utils,
        public userAction: UserActions,
        private navigationService: NavigationService
    ) {
    }
    back() {
        this.navigationService.back();
    }
    setBulkUploadRequest(): void {
        if (!this.user.name || !this.user.displayName || !this.user.location || !this.user.profilePicture) {
            this.utils.showMessage('error', 'Please add name, display name, location and profile picture for bulk upload request');
        } else {
            this.user.bulkUploadPermissionStatus = profileSettingsConstants.NONE;
            this.store.dispatch(this.userAction.addUserProfile(this.user, false));
        }
    }

    ngOnInit(): void {
        this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
            if (this.user) {
                switch (this.user.bulkUploadPermissionStatus) {
                    case this.NONE: { this.bulkUploadBtnText = profileSettingsConstants.BULK_UPLOAD_REQUEST_BTN_TEXT; break; }
                    case this.PENDING: { this.bulkUploadBtnText = profileSettingsConstants.BULK_UPLOAD_SEND_REQUEST_AGAIN_BTN_TEXT; break; }
                    default: { this.bulkUploadBtnText = profileSettingsConstants.BULK_UPLOAD_REQUEST_BTN_TEXT; break; }
                }
            }
        }));
    }

    navigateToUserAccount() {
        this.routerExtensions.navigate(['/user/my/profile', this.user ? this.user.userId : ''],
            { queryParams: { backUrl: '/user/my/questions/bulk-upload-request' } });
    }

    ngOnDestroy() { }

}
