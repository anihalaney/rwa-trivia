const firebaseAuthService = require('../services/firebase-auth.service');
import { User } from '../../projects/shared-library/src/lib/shared/model';

export class AuthUser {

    async getUsers(authUsers: User[], pageToken?: string): Promise<User[]> {
        const listUsersResult = await firebaseAuthService.getAuthUsers(pageToken);
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
    }
}

