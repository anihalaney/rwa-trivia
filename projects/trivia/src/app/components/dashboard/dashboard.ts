import { Inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { PLATFORM_ID } from '@angular/core';
import { QuestionActions, GameActions, UserActions } from 'shared-library/core/store/actions';
import * as gamePlayActions from '../../game-play/store/actions';
import { User, Game, OpponentType, Invitation } from 'shared-library/shared/model';
import { WindowRef } from 'shared-library/core/services';
import { AppState, appState} from '../../store';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

export class Dashboard {
    user: User;
    subs: Subscription[] = [];
    users: User[];
    activeGames$: Observable<Game[]>;
    userDict$: Observable<{ [key: string]: User }>;
    gameSliceStartIndex: number;
    gameSliceLastIndex: number;
    gameInviteSliceStartIndex: number;
    gameInviteSliceLastIndex: number;
    now: Date;
    greeting: string;
    message: string;
    activeGames: Game[];
    showGames: boolean;
    showNewsCard = true;
    userDict: { [key: string]: User } = {};
    missingCardCount = 0;
    numbers = [];
    gameInvites: Game[];
    friendCount = 0;
    randomPlayerCount = 0;
    maxGameCardPerRow: number;
    screenWidth: number;
    friendInvitations: Invitation[] = [];
    friendInviteSliceStartIndex: number;
    friendInviteSliceLastIndex: number;


    constructor(public store: Store<AppState>,
        private questionActions: QuestionActions,
        private gameActions: GameActions,
        private userActions: UserActions, private windowRef: WindowRef,
        @Inject(PLATFORM_ID) private platformId: Object) {
        this.activeGames$ = store.select(appState.coreState).pipe(select(s => s.activeGames));
        this.userDict$ = store.select(appState.coreState).pipe(select(s => s.userDict));
        this.subs.push(store.select(appState.coreState).pipe(select(s => s.user)).subscribe(user => {
            this.user = user;
            this.store.dispatch(this.gameActions.getActiveGames(user));
            this.store.dispatch(this.userActions.loadGameInvites(user));
            this.showNewsCard = this.user && this.user.isSubscribed ? false : true;
        }));
        this.subs.push(this.userDict$.subscribe(userDict => this.userDict = userDict));
        this.subs.push(this.activeGames$.subscribe(games => {
            this.activeGames = games;
            if (games.length > 0) {
                if (!(isPlatformBrowser(this.platformId) === false && isPlatformServer(this.platformId) === false)) {
                    this.screenWidth = this.windowRef.nativeWindow.innerWidth;
                    this.checkCardCountPerRow();
                }
                this.activeGames.map(game => {
                    const playerIds = game.playerIds;
                    playerIds.map(playerId => {
                        if (playerId !== this.user.userId) {
                            if (this.userDict[playerId] === undefined) {
                                this.store.dispatch(this.userActions.loadOtherUserProfile(playerId));
                            }

                        }
                    });
                });
                this.showGames = true;
            }
        }));


        this.gameSliceStartIndex = 0;
        this.gameSliceLastIndex = 8;

        store.select(appState.coreState).pipe(select(s => s.gameInvites)).subscribe(iGames => {
            this.gameInvites = iGames;
            this.friendCount = 0;
            this.randomPlayerCount = 0;
            iGames.map(iGame => {
                if (Number(iGame.gameOptions.opponentType) === OpponentType.Friend) {
                    this.friendCount++;
                } else if (Number(iGame.gameOptions.opponentType) === OpponentType.Random) {
                    this.randomPlayerCount++;
                }
                this.store.dispatch(this.userActions.loadOtherUserProfile(iGame.playerIds[0]));
            });
        });
        this.gameInviteSliceStartIndex = 0;
        this.gameInviteSliceLastIndex = 3;

        this.subs.push(store.select(appState.userState).pipe(select(s => s.friendInvitations)).subscribe(invitations => {
            if (invitations.length > 0) {
                this.friendInvitations = invitations;
                invitations.map(invitation => {
                    this.store.dispatch(this.userActions.loadOtherUserProfile(invitation.created_uid));
                });
            }
        }));

        this.friendInviteSliceStartIndex = 0;
        this.friendInviteSliceLastIndex = 3;

    }

    displayMoreGames(): void {
        this.gameSliceLastIndex = (this.activeGames.length > (this.gameSliceLastIndex + 8)) ?
            this.gameSliceLastIndex + 8 : this.activeGames.length;
        this.checkCardCountPerRow();
    }

    displayMoreGameInvites(): void {
        this.gameInviteSliceLastIndex = (this.gameInvites.length > (this.gameInviteSliceLastIndex + 3)) ?
            this.gameInviteSliceLastIndex + 3 : this.gameInvites.length;
    }


    displayMoreFriendInvites(): void {
        this.friendInviteSliceLastIndex = (this.friendInvitations.length > (this.friendInviteSliceLastIndex + 3)) ?
            this.friendInviteSliceLastIndex + 3 : this.friendInvitations.length;
    }

    checkCardCountPerRow() {
        this.numbers = [];
        if (this.screenWidth > 1000 && this.screenWidth < 1200) {
            this.maxGameCardPerRow = 3;
        } else {
            this.maxGameCardPerRow = 4;
        }
        if (this.activeGames.length > 0) {
            if (this.activeGames.length < this.maxGameCardPerRow) {
                this.missingCardCount = this.maxGameCardPerRow - this.activeGames.length;
                this.numbers = Array(this.missingCardCount).fill(0).map((x, i) => i);
            } else if (this.activeGames.length > this.maxGameCardPerRow && this.activeGames.length <= this.gameSliceLastIndex) {
                const diff = Math.trunc(this.activeGames.length / this.maxGameCardPerRow);
                if (this.activeGames.length % this.maxGameCardPerRow !== 0) {
                    this.missingCardCount = (diff + 1) * this.maxGameCardPerRow - this.activeGames.length;
                    this.numbers = Array(this.missingCardCount).fill(0).map((x, i) => i);
                }

            }
        }
    }
}
