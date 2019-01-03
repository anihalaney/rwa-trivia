import { PipeTransform, Pipe } from '@angular/core';
import { GameStatus, User } from 'shared-library/shared/model';
import { CoreState, coreState } from './../../core/store';
import { Store, select } from '@ngrx/store';
@Pipe({
    name: 'gamefilter',
    pure: false
})
export class GameFilterPipe implements PipeTransform {
    gameStatus: any = GameStatus;
    user: User;
    constructor(public store: Store<CoreState>) {

        this.store.select(coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;

        });

    }
    transform(items: any[], gamefilter: (item: any, gameStatus, user) => boolean): any {
        if (!items || !gamefilter) {
            return items;
        }
        return items.filter(item => gamefilter(item, this.gameStatus, this.user));
    }
}
