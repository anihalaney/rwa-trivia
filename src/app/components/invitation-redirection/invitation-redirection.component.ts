import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'invitation-redirection',
    templateUrl: './invitation-redirection.component.html',
    styleUrls: ['./invitation-redirection.component.scss', './invitation-redirection.component.scss']
})
export class InvitationRedirectionComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute, private router: Router) {

    }

    ngOnInit() {
        // subscribe to router event
        this.activatedRoute.params.subscribe((params: Params) => {
            const token = params['token'];
            setTimeout(() => {
                this.router.navigate(['/dashboard']);
            }, 3000);

        });
    }

}
