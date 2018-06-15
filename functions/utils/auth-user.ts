const firebaseAuthService = require('../services/firebase-auth.service');
import { User } from '../../src/app/model';

export class AuthUser {

    getUsers(authUsers: User[], pageToken?: string): Promise<User[]> {
        return firebaseAuthService.getAuthUsers(pageToken).then((listUsersResult) => {
            listUsersResult.users.map((afUser) => {
                const user = new User(afUser);
                delete user['authState'];
                authUsers.push(user);
            });
            if (listUsersResult.pageToken) {
                return this.getUsers(authUsers, listUsersResult.pageToken);
            } else {
                return authUsers;
            }
        });
    }
}

