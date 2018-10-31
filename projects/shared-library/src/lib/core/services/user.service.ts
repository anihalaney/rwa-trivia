import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { User, Invitation, Friends, QueryParams, QueryParam, friendInvitationConstants } from './../../../lib/shared/model';
import { CONFIG } from './../../environments/environment';
import { DbService } from './../db-service';
import { Utils } from './utils';

@Injectable()
export class UserService {

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
                    if (u.stats) {
                        user.stats = u.stats;
                    }
                } else {
                    const dbUser = Object.assign({}, user); // object to be saved
                    delete dbUser.authState;
                    delete dbUser.profilePictureUrl;
                    this.dbService.setDoc('users', dbUser.userId, dbUser);
                }

                return user;
            }),
                mergeMap(u => this.getUserProfileImage(u)));
    }

    saveUserProfile(user: User): Observable<any> {
        const url = `${CONFIG.functionsUrl}/app/user/profile`;
        user.roles = (!user.roles) ? {} : user.roles;
        const dbUser = Object.assign({}, user); // object to be saved
        delete dbUser.authState;
        delete dbUser.profilePictureUrl;
        return this.http.post<User>(url, { user: dbUser });

    }


    loadOtherUserProfile(userId: string): Observable<User> {
        const url = `${CONFIG.functionsUrl}/app/user/${userId}`;
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
        const url = `${CONFIG.functionsUrl}/app/friend/invitation`;
        return this.http.post<any>(url, obj);
    }

    checkInvitationToken(obj: any): Observable<any> {
        const url = `${CONFIG.functionsUrl}/app/friend`;
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
}
