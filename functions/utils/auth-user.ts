import { FirebaseAuthService } from '../services/firebase-auth.service';
import { User, UserConstants } from '../../projects/shared-library/src/lib/shared/model';
import { Utils } from '../utils/utils';

export class AuthUser {

    static async getUsers(authUsers: User[], pageToken?: string): Promise<User[]> {
        try {
            const listUsersResult = await FirebaseAuthService.getAuthUsers(pageToken);
            for (const afUser of listUsersResult.users) {
                const user = new User(afUser);
                delete user[UserConstants.AUTH_STATE];
                authUsers.push(user);
            }
            if (listUsersResult.pageToken) {
                return AuthUser.getUsers(authUsers, listUsersResult.pageToken);
            } else {
                return authUsers;
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
