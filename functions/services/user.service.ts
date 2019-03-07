import { CollectionConstants, GeneralConstants, User, UserConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class UserService {

    private static fireStoreClient: any = admin.firestore();
    private static bucket: any = admin.storage().bucket();
    private static FS = GeneralConstants.FORWARD_SLASH;

    /**
    * getUsers
    * return users
    */
    static async getUsers(): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(await this.fireStoreClient.collection(CollectionConstants.USERS).get());
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getUserById
     * return user
    */
    static async getUserById(userId: string): Promise<any> {
        try {
            const userData = await this.fireStoreClient
                .doc(`${this.FS}${CollectionConstants.USERS}${this.FS}${userId}`)
                .get();
            return userData.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * updateUser
     * return ref
     */
    static async updateUser(dbUser: any): Promise<any> {
        try {
            return await this.fireStoreClient
                .doc(`${this.FS}${CollectionConstants.USERS}${this.FS}${dbUser.userId}`)
                .update(dbUser);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getUsersByEmail
     * return users
     */
    static async getUsersByEmail(obj: any): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(
                await this.fireStoreClient
                    .collection(CollectionConstants.USERS)
                    .where(GeneralConstants.EMAIL, GeneralConstants.DOUBLE_EQUAL, obj.email)
                    .get()
            );
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getUserProfile
     * return user
    */
    static async getUserProfile(userId: string): Promise<any> {
        try {
            const dbUser: User = await this.getUserById(userId);
            const user = new User();
            user.displayName = (dbUser && dbUser.displayName) ? dbUser.displayName : '';
            user.location = (dbUser && dbUser.location) ? dbUser.location : '';
            user.profilePicture = (dbUser && dbUser.profilePicture) ? dbUser.profilePicture : '';
            user.userId = userId;
            return user;
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
   * getUserProfileImage
   * return stream;
  */
    static async getUserProfileImage(userId: string, width: string, height: string): Promise<any> {
        try {
            const dbUser: User = await this.getUserById(userId);
            return await this.generateProfileImage(userId, dbUser.profilePicture, `${width}*${height}`);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * generateProfileImage
     * return stream
     */
    static async generateProfileImage(userId: string, profilePicture: string, size?: string): Promise<string> {
        const fileName = (size) ?
            `${UserConstants.PROFILE}${this.FS}${userId}${this.FS}${UserConstants.AVATAR}${this.FS}${size}${this.FS}${profilePicture}`
            : `${UserConstants.PROFILE}${this.FS}${userId}${this.FS}${UserConstants.AVATAR}${this.FS}${profilePicture}`;
        const file = this.bucket.file(fileName);
        try {
            const streamData = await file.download();
            return streamData[0];
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * Add/Update Authenticated Users
     * return ref
     */
    static async addUpdateAuthUsersToFireStore(users: Array<User>): Promise<any> {
        const BATCH_SIZE = 500;
        const chunks: User[][] = [];

        for (let i = 0; i < users.length; i += BATCH_SIZE) {
            chunks.push(users.slice(i, i + BATCH_SIZE));
        }

        const promises: Promise<any>[] = [];
        for (const chunk of chunks) {
            for (const user of chunk) {
                const batch = this.fireStoreClient.batch();
                Object.keys(user).forEach(key => user[key] === undefined && delete user[key]);
                const userInstance = this.fireStoreClient.collection(CollectionConstants.USERS).doc(user.userId);
                batch.set(userInstance, { ...user }, { merge: true });

                promises.push(batch.commit());
            }
        }
        try {
            return await Promise.all(promises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * uploadProfileImage
     * return status
    */
    static async uploadProfileImage(data: any, mimeType: any, filePath: string, ): Promise<any> {
        const stream = require('stream');
        const file = this.bucket.file(filePath);
        const dataStream = new stream.PassThrough();
        dataStream.push(data);
        dataStream.push(null);
        mimeType = (mimeType) ? mimeType : dataStream.mimetype;

        return new Promise((resolve, reject) => {
            dataStream.pipe(file.createWriteStream({
                metadata: {
                    contentType: mimeType,
                    metadata: {
                        custom: UserConstants.META_DATA
                    }
                }
            }))
                .on(GeneralConstants.ERROR, (error) => {
                    Utils.throwError(error);
                })
                .on(GeneralConstants.FINISH, () => {
                    resolve(UserConstants.UPLOAD_FINISHED);
                });
        });
    }

    /**
     * uploadProfileImage
     * return status
     */
    static async removeSocialProfile(): Promise<any> {
        const users: User[] = await this.getUsers();

        const migrationPromises: Promise<any>[] = [];

        for (const user of users) {
            if (user && user.userId) {
                delete user.facebookUrl;
                delete user.linkedInUrl;
                delete user.twitterUrl;
                migrationPromises.push(this.updateUser({ ...user }));
            }
        }
        try {
            return await Promise.all(migrationPromises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
