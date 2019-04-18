import { OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AchievementRule, User } from '../../../../../shared-library/src/lib/shared/model';
import { dashboardState } from '../../dashboard/store';
import * as dashboardAction from '../../dashboard/store/actions';
import { AppState, appState } from '../../store';
export class Achievements implements OnDestroy {

    user: User;
    achievements: Array<AchievementRule> = [];
    subscriptions = [];

    constructor(
        public store: Store<AppState>
    ) {
        this.subscriptions.push(store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
            if (this.user) {
                this.store.dispatch(new dashboardAction.LoadAchievements());
            }
        }));

        this.subscriptions.push(this.store.select(dashboardState).pipe(select(s => s.achievements)).subscribe(achievements => {
            if (achievements) {
                this.achievements = achievements;
            }
        }));
    }

    ngOnDestroy() {

    }

}
