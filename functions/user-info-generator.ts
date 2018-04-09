import { User } from '../src/app/model';
import { Observable } from 'rxjs/Observable';

export class UserInfoGenerator {

    private userId: string;
    private db: any
    private userInfo: User;

    constructor(private uid, private firebaseDB: any) {
        this.userId = uid;
        this.db = firebaseDB;
    }


    getUserInfo(): Promise<User> {

        return this.db.firestore().doc(`/users/${this.userId}`)
            .get()
            .then(u => {
                const user = u.data();
                console.log('user--->', user);
                this.userInfo = new User(undefined);
                this.userInfo.displayName = (user && user.displayName) ? user.displayName : '';
                this.userInfo.location = (user && user.location) ? user.location : '';
                this.userInfo.profilePicture = (user && user.profilePicture) ? user.profilePicture : '';
                this.userInfo.userId = this.userId;
                console.log('userinfo--->', this.userInfo);
                return this.userInfo;
            })
            .catch(error => {
                console.error(error);
            });

    }

}
