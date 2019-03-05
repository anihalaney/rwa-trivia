const firebaseAuthService = require('../services/firebase-auth.service');
import { User } from '../../projects/shared-library/src/lib/shared/model';

export class AuthUser {

    getUsers = async (authUsers: User[], pageToken?: string): Promise<User[]> => {
        try {
            const listUsersResult = await firebaseAuthService.getAuthUsers(pageToken);
            for (const afUser of listUsersResult.users) {
                const user = new User(afUser);
                delete user['authState'];
                authUsers.push(user);
            }
            if (listUsersResult.pageToken) {
                return this.getUsers(authUsers, listUsersResult.pageToken);
            } else {
                return authUsers;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
