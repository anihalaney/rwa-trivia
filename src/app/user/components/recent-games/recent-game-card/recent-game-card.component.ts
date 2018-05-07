import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, appState, categoryDictionary } from '../../../../store';
import { User, Game, Category, PlayerMode } from '../../../../model';
import { userState } from '../../../store';
import { UserActions } from '../../../../core/store/actions';

@Component({
    selector: 'recent-game-card',
    templateUrl: './recent-game-card.component.html',
    styleUrls: ['./recent-game-card.component.scss']
})
export class RecentGameCardComponent implements OnChanges {
    @Input() game: Game;
    @Input() userDict: { [key: string]: User };
    @Input() user: User;

    PlayerMode = PlayerMode;
    correctAnswerCount: number;
    questionIndex: number;
    myTurn: boolean;
    categoryDictObs: Observable<{ [key: number]: Category }>;
    categoryDict: { [key: number]: Category };

    constructor(private store: Store<AppState>, private userActions: UserActions) {

        this.categoryDictObs = store.select(categoryDictionary);
        this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict);

    }

    getOpponentId(game) {
        return this.game.playerIds.filter(userId => userId !== this.user.userId)[0];
    }

    ngOnChanges() {
        if (this.game) {
            if (this.userDict[this.getOpponentId(this.game)] === undefined) {
                this.store.dispatch(this.userActions.loadOtherUserProfile(this.getOpponentId(this.game)));
            }

        }
    }


}
