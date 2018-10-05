import { Component, OnInit } from "@angular/core";
import { Store, select } from '@ngrx/store';
import { User } from 'shared-library/shared/model';
import { AppState, appState } from './../../../../store';
import { Observable, Subscription } from 'rxjs';


@Component({
    moduleId: module.id,
    selector: "ns-leaderboard-container",
    templateUrl: "leaderboard-container.component.html",
    styleUrls: ["leaderboard-container.component.scss"]
})
export class LeaderBoardContainerComponent implements OnInit {

    userDict$: Observable<{ [key: string]: User }>;
    subs: Subscription[] = [];
    userDict: { [key: string]: User } = {};

    constructor(store: Store<AppState>) {
        this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
        this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));
    }
    ngOnInit() {

    }
}
