import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
    friendInvitationConstants, Friends, Game, GameOperations, GameStatus, Invitation, QueryParam, QueryParams, User, RoutesConstants
} from './../../../lib/shared/model';
import { CONFIG } from './../../environments/environment';
import { DbService } from './../db-service';
import { Utils } from './utils';
import { Country } from 'shared-library/shared/mobile/component/countryList/model/country.model';

@Injectable()
export class UserService {

    private RC = RoutesConstants;

    constructor(
        private http: HttpClient,
        private dbService: DbService,
        private utils: Utils) {
    }

    loadUserProfile(user: User): Observable<User> {

        return this.dbService.valueChanges('users', user.userId)
            .pipe(map(u => {
                if (u) {
                    const userInfo = user;
                    user = u;
                    user.idToken = userInfo.idToken;
                    user.authState = userInfo.authState;
                } else {
                    const dbUser = Object.assign({}, user); // object to be saved
                    delete dbUser.authState;
                    delete dbUser.profilePictureUrl;

                    console.log('db User ====> ', dbUser);

                    this.dbService.setDoc('users', dbUser.userId, dbUser);
                }
                return user;
            }),
                mergeMap(u => this.getUserProfileImage(u)));
    }

    loadAccounts(user): Observable<any> {
        return this.dbService.valueChanges('accounts', user.userId);
    }

    saveUserProfile(user: User): Observable<any> {
        const url = `${CONFIG.functionsUrl}/user/profile`;
        user.roles = (!user.roles) ? {} : user.roles;
        const dbUser = Object.assign({}, user); // object to be saved
        delete dbUser.authState;
        delete dbUser.profilePictureUrl;
        return this.http.post<User>(url, { user: dbUser });

    }

    addFeedback(feedback): Observable<any> {
        return this.dbService.CreateDocWithoutDocID('feedback', feedback);
    }

    getCountries(): Observable<Country[]> {
        return this.dbService.valueChanges('countries');
    }

    loadOtherUserProfile(userId: string): Observable<User> {
        const url = `${CONFIG.functionsUrl}/user/${userId}`;
        return this.http.get<User>(url);
    }

    loadOtherUserProfileWithExtendedInfo(userId: string): Observable<User> {
        const url = `${CONFIG.functionsUrl}/user/extendedInfo/${userId}`;
        return this.http.get<User>(url);
    }


    getUserProfileImage(user: User): Observable<User> {
        if (user.profilePicture && user.profilePicture !== '') {
            user.profilePictureUrl = this.utils.getImageUrl(user, 263, 263, '400X400');
            return of(user);
        } else {
            user.profilePictureUrl = '/assets/images/default-avatar-small.png';
            return of(user);
        }
    }

    setSubscriptionFlag(userId: string) {
        this.dbService.updateDoc('users', userId, { isSubscribed: true });
    }

    saveUserInvitations(obj: any): Observable<string> {
        const url = `${CONFIG.functionsUrl}/friend/invitation`;
        return this.http.post<any>(url, obj);
    }

    checkInvitationToken(obj: any): Observable<any> {
        const url = `${CONFIG.functionsUrl}/friend`;
        return this.http.post<any>(url, obj);
    }

    loadUserFriends(userId: string): Observable<Friends> {
        return this.dbService.valueChanges('friends', userId);
    }

    loadFriendInvitations(email: string): Observable<Invitation[]> {
        const queryParams: QueryParams = new QueryParams();
        queryParams.condition = [];

        let queryParam: QueryParam = new QueryParam('email', '==', email);
        queryParams.condition.push(queryParam);

        queryParam = new QueryParam('status', '==', friendInvitationConstants.PENDING);
        queryParams.condition.push(queryParam);


        return this.dbService.valueChanges('invitations', '', queryParams).pipe(
            map(invitations => invitations));
    }

    setInvitation(invitation: Invitation) {
        this.dbService.updateDoc('invitations', invitation.id, invitation);
    }

    getGameInvites(user: User): Observable<Game[]> {
        if (user && user.userId) {
            const queryParams1 = {
                condition: [{ name: 'GameStatus', comparator: '==', value: GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE },
                { name: 'playerId_1', comparator: '==', value: user.userId },
                { name: 'gameOver', comparator: '==', value: false }
                ],
                orderBy: [{ name: 'turnAt', value: 'desc' }]
            };
            const query1 = this.dbService.valueChanges('games', '', queryParams1);
            const queryParams2 = {
                condition: [{ name: 'GameStatus', comparator: '==', value: GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE },
                { name: 'playerId_1', comparator: '==', value: user.userId },
                { name: 'gameOver', comparator: '==', value: false }
                ],
                orderBy: [{ name: 'turnAt', value: 'desc' }]
            };
            const query2 = this.dbService.valueChanges('games', '', queryParams2);
            return combineLatest(query1, query2)
                .pipe(map((data) => data[0].concat(data[1])),
                    map(gs => gs.map(g => Game.getViewModel(g))
                        .sort((a: any, b: any) => b.turnAt - a.turnAt)
                    )
                );
        } else {
            return of<Game[]>([]);
        }
    }

    rejectGameInvitation(gameId: string) {
        return this.http.put(`${CONFIG.functionsUrl}/game/${gameId}`,
            {
                operation: GameOperations.REJECT_GAME
            });
    }

    updateUser(user: User) {
        const dbUser = Object.assign({}, user);
        this.dbService.setDoc('users', dbUser.userId, dbUser);
    }

    addUserLives(userId: string) {
        const url = `${CONFIG.functionsUrl}/user/update-lives`;
        return this.http.post<any>(url, { userId: userId });
    }

    checkDisplayName(displayName: string): Observable<any> {
        const url = `${CONFIG.functionsUrl}/${this.RC.USER}/${this.RC.CHECK}/${this.RC.DISPLAY_NAME}/${displayName}`;
        return this.http.get<any>(url);
    }

    getAddressByLatLang(latlong) {
        console.log(CONFIG.firebaseConfig.apiKey);
        const url = `${CONFIG.addressByLatLongURL}?latlng=${latlong}&key=${CONFIG.firebaseConfig.apiKey}`;
        return this.http.get<any>(url);
    }

    getAddressSuggestions(address) {
        console.log(CONFIG.firebaseConfig.apiKey);
        // tslint:disable-next-line:max-line-length
        const url = `${CONFIG.addressSuggestionsURL}?input=${encodeURIComponent(address)}&key=${CONFIG.firebaseConfig.apiKey}`;
        return this.http.get<any>(url);
    }
}
