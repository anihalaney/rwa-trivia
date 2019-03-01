import admin from '../db/firebase.client';
import { User } from '../../projects/shared-library/src/lib/shared/model';

export class UserService {

    static fireStoreClient: any = admin.firestore();
    static bucket: any = admin.storage().bucket();

    /**
    * getUsers
    * return users
    */
    public static async getUsers(): Promise<any> {
        try {
            return await this.fireStoreClient.collection('users').get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    /**
     * getUserById
     * return user
    */
    public static async getUserById(userId: string): Promise<any> {
        try {
            return await this.fireStoreClient.doc(`/users/${userId}`).get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * updateUser
     * return ref
     */
    public static async updateUser(dbUser: any): Promise<any> {

        try {
            return await this.fireStoreClient.doc(`/users/${dbUser.userId}`).update(dbUser);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    /**
     * getUsersByEmail
     * return users
     */
    public static async getUsersByEmail(obj: any): Promise<any> {
        try {
            return await this.fireStoreClient.collection('users').where('email', '==', obj.email).get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    /**
     * getUserProfile
     * return user
    */
    public static async getUserProfile(userId: string): Promise<any> {
        try {
            const userData = await this.getUserById(userId);
            const dbUser = userData.data();
            const user = new User();
            user.displayName = (dbUser && dbUser.displayName) ? dbUser.displayName : '';
            user.location = (dbUser && dbUser.location) ? dbUser.location : '';
            user.profilePicture = (dbUser && dbUser.profilePicture) ? dbUser.profilePicture : '';
            user.userId = userId;
            return user;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
   * getUserProfileImage
   * return stream;
  */
    public static async getUserProfileImage(userId: string, width: string, height: string): Promise<any> {
        try {
            const userData = await this.getUserById(userId);
            const dbUser = userData.data();
            return await this.generateProfileImage(userId, dbUser.profilePicture, `${width}*${height}`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * generateProfileImage
     * return stream
     */
    public static async generateProfileImage(userId: string, profilePicture: string, size?: string): Promise<string> {
        const fileName = (size) ? `profile/${userId}/avatar/${size}/${profilePicture}` : `profile/${userId}/avatar/${profilePicture}`;
        const file = this.bucket.file(fileName);
        try {
            const streamData = await file.download();
            return streamData[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Add/Update Authenticated Users
     * return ref
     */
    public static async addUpdateAuthUsersToFireStore(users: Array<User>): Promise<any> {
        const BATCH_SIZE = 500;
        const chunks: User[][] = [];

        for (let i = 0; i < users.length; i += BATCH_SIZE) {
            chunks.push(users.slice(i, i + BATCH_SIZE));
        }

        let promises: Promise<any>[];
        for (const chunk of chunks) {
            promises = chunk.map((user) => {
                const batch = this.fireStoreClient.batch();
                Object.keys(user).forEach(key => user[key] === undefined && delete user[key]);
                const userInstance = this.fireStoreClient.collection('users').doc(user.userId);
                batch.set(userInstance, { ...user }, { merge: true });
                return batch.commit().then((ref) => {
                    return ref;
                });
            });
        }
        try {
            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }



    /**
     * uploadProfileImage
     * return status
    */
    public static async uploadProfileImage(data: any, mimeType: any, filePath: string, ): Promise<any> {
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
                        custom: 'metadata'
                    }
                }
            }))
                .on('error', function (err) {
                    console.log('error', err);
                    reject(err);
                })
                .on('finish', function () {
                    resolve('upload finished');
                });
        });

    }

    /**
     * uploadProfileImage
     * return status
     */
    public static async removeSocialProfile(): Promise<any> {
        const users = await this.getUsers();

        const migrationPromises = users.docs.map(user => {
            const userObj: User = user.data();
            userObj.facebookUrl = null;
            userObj.linkedInUrl = null;
            userObj.twitterUrl = null;
            return this.updateUser(userObj);
        });

        const migrationResults = await Promise.all(migrationPromises);
        return migrationResults;
    }
}

















