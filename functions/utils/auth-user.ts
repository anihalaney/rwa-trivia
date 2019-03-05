import { FirebaseAuthService } from '../services/firebase-auth.service';
import { User } from '../../projects/shared-library/src/lib/shared/model';

export class AuthUser {

    static async getUsers(authUsers: User[], pageToken?: string): Promise<User[]> {
        try {
            const listUsersResult = await FirebaseAuthService.getAuthUsers(pageToken);
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
            console.error('Error : ', error);
            throw error;
        }
    }
}
