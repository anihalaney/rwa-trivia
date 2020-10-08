import { Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';
import { CoreState, coreState } from '../../../../core/store';
import { User } from 'shared-library/shared/model';
import { Utils } from './../../../../core/services';
import { NavigationService } from 'shared-library/core/services/mobile';


@Component({
    selector: 'ns-action-bar',
    moduleId: module.id,
    templateUrl: 'action-bar.component.html',
    styleUrls: ['action-bar.component.css']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class ActionBarComponent implements OnDestroy, OnInit {

    user: User;
    subscriptions = [];

    @Input() title;
    @Input() hideMenu;
    @Input() hideHomeIcon;
    @Input() showSkipBtn;
    @Input() subTitle;
    @Input() showEdit;
    @Input() emitBackEvent;
    @Output() isBackPress: EventEmitter<any> = new EventEmitter<any>();
    @Output() open: EventEmitter<any> = new EventEmitter<any>();
    photoUrl: '';

    constructor(
        private routerExtensions: RouterExtensions,
        public store: Store<CoreState>,
        public cd: ChangeDetectorRef,
        public utils: Utils,
        private navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
            this.photoUrl = this.utils.getImageUrl(user, 70, 60, '70X60');
        }));

    }

    back() {
        if (this.emitBackEvent) {
            this.isBackPress.emit(true);
        } else {
            this.navigationService.back();
        }
    }
    navigateToBulkUpload() {
        this.routerExtensions.navigate(['/user/my/questions/bulk-upload-request']);
    }

    openSidebar() {
        this.open.emit();
        this.openSideDrawer();
    }

    openSideDrawer() {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    goToDashboard() {
        this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
    }

    navigateToProfile() {
        if (this.showEdit.showEditOrOptions === 'edit') {
            this.routerExtensions.navigate([this.showEdit.routing, this.showEdit.userId]);
        }
    }

    navigateToSubmitQuestion() {
        this.routerExtensions.navigate(['/user/my/questions/add']);
    }

    navigateToMyQuestion() {
        this.routerExtensions.navigate(['/user/my/questions']);
    }

    navigateToInvite() {
        this.routerExtensions.navigate(['/user/my/app-invite-friends-dialog', { showSkip: false }]);
    }

    ngOnDestroy() {

    }

}
