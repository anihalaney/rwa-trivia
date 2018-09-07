import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { User, Game, Category, PlayerMode, GameStatus } from '../../../../../../../shared-library/src/lib/shared/model';
import { Utils } from '../../../../../../../shared-library/src/lib/core/services';
import { AppState, appState, categoryDictionary } from '../../../../store';
import { userState } from '../../../store';
import { UserActions } from '../../../../../../../shared-library/src/lib/core/store/actions';


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
    otherUserId: string;
    userProfileImageUrl: string;
    REJECTED_GAME = GameStatus.REJECTED;
    EXPIRED_GAME = GameStatus.INVITATION_TIMEOUT;

    constructor(private store: Store<AppState>, private userActions: UserActions) {

        this.categoryDictObs = store.select(categoryDictionary);
        this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict);

    }

    getOpponentId(game) {
        return game.playerIds.filter(userId => userId !== this.user.userId)[0];
    }

    ngOnChanges() {
        if (this.game) {
            this.otherUserId = this.getOpponentId(this.game);
            if (this.otherUserId !== undefined) {
                if (this.userDict[this.otherUserId] === undefined) {
                    this.store.dispatch(this.userActions.loadOtherUserProfile(this.otherUserId));
                }
            }
            this.userProfileImageUrl = this.getImageUrl(this.user);
        }
    }

    getImageUrl(user: User) {
        return Utils.getImageUrl(user, 44, 40, '44X40');
    }


}
