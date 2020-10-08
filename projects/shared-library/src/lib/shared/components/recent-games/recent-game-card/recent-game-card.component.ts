import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { User, Game, Category, PlayerMode, GameStatus, userCardType } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { coreState, CoreState, categoryDictionary } from 'shared-library/core/store';
import { UserActions } from 'shared-library/core/store/actions';
import { AutoUnsubscribe } from 'shared-library/shared/decorators';

@Component({
    selector: 'recent-game-card',
    templateUrl: './recent-game-card.component.html',
    styleUrls: ['./recent-game-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class RecentGameCardComponent implements OnInit, OnDestroy {
    @Input() game: Game;
    // @Input() userDict: { [key: string]: User };
    @Input() user: User;
    userDict$: Observable<{ [key: string]: User }>;
    userDict: { [key: string]: User } = {};
    PlayerMode = PlayerMode;
    correctAnswerCount: number;
    questionIndex: number;
    myTurn: boolean;
    categoryDictObs: Observable<{ [key: number]: Category }>;
    categoryDict: { [key: number]: Category };
    otherUserId: string;
    userProfileImageUrl: string;
    GameStatus = GameStatus;
    subscriptions = [];
    userCardType = userCardType;

    constructor(private store: Store<CoreState>, private userActions: UserActions, public utils: Utils, private cd: ChangeDetectorRef) {

        this.categoryDictObs = store.select(categoryDictionary);
        this.subscriptions.push(this.categoryDictObs.subscribe(categoryDict => {
            this.categoryDict = categoryDict
        }));
    }

    ngOnInit(): void {
        this.userDict$ = this.store.select(coreState).pipe(select(s => s.userDict));
        this.subscriptions.push(this.userDict$.subscribe(userDict => {
            this.userDict = userDict;
            this.cd.markForCheck();
        }));
        if (this.game) {
            this.otherUserId = this.getOpponentId(this.game);
        }
    }

    getOpponentId(game) {
        return game.playerIds.filter(userId => userId !== this.user.userId)[0];
    }

    ngOnDestroy() {
    }
}
