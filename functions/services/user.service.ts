import admin from '../db/firebase.client';
import { User } from '../../projects/shared-library/src/lib/shared/model';

export class UserService {

    private static fireStoreClient: any = admin.firestore();
    private static bucket: any = admin.storage().bucket();

    /**
    * getUsers
    * return users
    */
    static async getUsers(): Promise<any> {
        try {
            return await this.fireStoreClient.collection('users').get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }


    /**
     * getUserById
     * return user
    */
    static async getUserById(userId: string): Promise<any> {
        try {
            return await this.fireStoreClient.doc(`/users/${userId}`).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * updateUser
     * return ref
     */
    static async updateUser(dbUser: any): Promise<any> {

        try {
            return await this.fireStoreClient.doc(`/users/${dbUser.userId}`).update(dbUser);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }


    /**
     * getUsersByEmail
     * return users
     */
    static async getUsersByEmail(obj: any): Promise<any> {
        try {
            return await this.fireStoreClient.collection('users').where('email', '==', obj.email).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }


    /**
     * getUserProfile
     * return user
    */
    static async getUserProfile(userId: string): Promise<any> {
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
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
   * getUserProfileImage
   * return stream;
  */
    static async getUserProfileImage(userId: string, width: string, height: string): Promise<any> {
        try {
            const userData = await this.getUserById(userId);
            const dbUser = userData.data();
            return await this.generateProfileImage(userId, dbUser.profilePicture, `${width}*${height}`);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * generateProfileImage
     * return stream
     */
    static async generateProfileImage(userId: string, profilePicture: string, size?: string): Promise<string> {
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
                const userInstance = this.fireStoreClient.collection('users').doc(user.userId);
                batch.set(userInstance, { ...user }, { merge: true });

                promises.push(batch.commit());
            }
        }
        try {
            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            console.error('Error : ', error);
            throw error;
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
                        custom: 'metadata'
                    }
                }
            }))
                .on('error', function (error) {
                    console.error('Error : ', error);
                    reject(error);
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
    static async removeSocialProfile(): Promise<any> {
        const users = await this.getUsers();
        let migrationPromises: Promise<any>[];

        for (const user of users) {
            const userObj: User = user.data();
            delete userObj.facebookUrl;
            delete userObj.linkedInUrl;
            delete userObj.twitterUrl;
            migrationPromises.push(this.updateUser(userObj));
        }
        
        try {
            return await Promise.all(migrationPromises);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

















