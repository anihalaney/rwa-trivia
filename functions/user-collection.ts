import { User } from '../src/app/model';
import { Observable } from 'rxjs/Observable';

export class UserCollection {

    private db: any;
    constructor(private firebaseDB: any) {
        this.db = firebaseDB;
    }

    getUserById(uid: string): Promise<User> {
        return this.db.firestore().doc(`/users/${uid}`)
            .get()
            .then(u => {
                const dbUser = u.data();
                console.log('user--->', dbUser);
                const user = new User();
                user.displayName = (dbUser && dbUser.displayName) ? dbUser.displayName : '';
                user.location = (dbUser && dbUser.location) ? dbUser.location : '';
                user.profilePicture = (dbUser && dbUser.profilePicture) ? dbUser.profilePicture : '';
                user.userId = uid;
                console.log('userinfo--->', user);
                return user;
            })
            .catch(error => {
                console.error(error);
            });
    }

}
