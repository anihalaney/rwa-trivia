import { Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { RouterExtensions } from 'nativescript-angular/router';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { select, Store } from '@ngrx/store';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { CoreState, coreState } from '../../../../core/store';
import { User } from 'shared-library/shared/model';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'ns-action-bar',
    moduleId: module.id,
    templateUrl: 'action-bar.component.html',
    styleUrls: ['action-bar.component.css']
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class ActionBarComponent implements OnDestroy {

    user: User;
    subscriptions = [];
    notifications = [];
    @Input() title;
    @Input() hideMenu;
    @Input() hideHomeIcon;
    @Input() showSkipBtn;
    @Output() open: EventEmitter<any> = new EventEmitter<any>();


    constructor(
        private routerExtensions: RouterExtensions,
        public store: Store<CoreState>,
        public cd: ChangeDetectorRef
    ) {
        this.subscriptions.push(store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
        }));

        this.subscriptions.push(this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
        }));
        this.subscriptions.push(combineLatest(store.select(coreState).pipe(select(s => s.friendInvitations)),
            store.select(coreState).pipe(select(s => s.gameInvites))).subscribe((notify: any) => {
                this.notifications = notify[0].concat(notify[1]);
                this.cd.markForCheck();
            }));
    }

    openSidebar() {
        this.open.emit();
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }


    goToDashboard() {
        this.routerExtensions.navigate(['/dashboard'], { clearHistory: true });
    }

    gotToNotification() {
        this.routerExtensions.navigate(['/notification']);
    }

    ngOnDestroy() {

    }

}
