import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { userState } from '../../user/store';
import { ActionWithPayload, UserActions } from ' ../../app/core/store/actions';
import { Store } from '@ngrx/store';
import { AppState, appState } from '../../store';

@Component({
    selector: 'invitation-redirection',
    templateUrl: './invitation-redirection.component.html',
    styleUrls: ['./invitation-redirection.component.scss', './invitation-redirection.component.scss']
})
export class InvitationRedirectionComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private store: Store<AppState>,
        private userAction: UserActions) {
    }

    ngOnInit() {
        // subscribe to router event
        this.activatedRoute.params.subscribe((params: Params) => {
            const token = params['token'];
            this.store.dispatch(this.userAction.storeInvitationToken(token));
            setTimeout(() => {
                this.router.navigate(['/dashboard']);
            }, 3000);

        });
    }

}
