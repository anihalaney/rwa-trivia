import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserActions } from '../../core/store/actions';
import { Store, select } from '@ngrx/store';
import { AppState, appState } from '../../store';
import { AuthenticationProvider } from '../../core/auth';
import { User } from '../../../../../shared-library/src/public_api';
import * as userActions from '../../user/store/actions';

@Component({
    selector: 'invitation-redirection',
    templateUrl: './invitation-redirection.component.html',
    styleUrls: ['./invitation-redirection.component.scss', './invitation-redirection.component.scss']
})
export class InvitationRedirectionComponent implements OnInit {
    @Input() user: User;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private store: Store<AppState>,
        private userAction: UserActions, private authService: AuthenticationProvider) {
        this.store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
            if (user) {
                this.user = user;
            }
        });
    }

    ngOnInit() {
        // subscribe to router event
        this.activatedRoute.params.subscribe((params: Params) => {
            const token = params['token'];
            this.store.dispatch(this.userAction.storeInvitationToken(token));
            if (this.user) {
                this.store.dispatch(new userActions.MakeFriend({ token: token, email: this.user.email, userId: this.user.authState.uid }))
            } else {
                this.router.navigate(['/dashboard']);
            }

        });
    }

}
