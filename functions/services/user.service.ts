import { CollectionConstants, GeneralConstants, User, UserConstants, Account } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import { AccountService } from './account.service';
import { AppSettings } from '../services/app-settings.service';
import { FriendService } from './friend.service';
export class UserService {

    private static fireStoreClient: any = admin.firestore();
    private static bucket: any = Utils.getFireStorageBucket(admin);

    /**
    * getUsers
    * return users
    */
    static async getUsers(): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(await UserService.fireStoreClient.collection(CollectionConstants.USERS).get());
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
            const userData = await UserService.fireStoreClient
                .doc(`/${CollectionConstants.USERS}/${userId}`)
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
            return await UserService.fireStoreClient
                .doc(`/${CollectionConstants.USERS}/${dbUser.userId}`)
                .set(dbUser, { merge: true });
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
                await UserService.fireStoreClient
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
    static async getUserProfile(userId: string, extendedInfo = false, loginUserId = ''): Promise<any> {
        try {
            const dbUser: User = await UserService.getUserById(userId);
            const user = new User();
            user.displayName = (dbUser && dbUser.displayName) ? dbUser.displayName : '';
            user.location = (dbUser && dbUser.location) ? dbUser.location : '';
            user.profilePicture = (dbUser && dbUser.profilePicture) ? dbUser.profilePicture : '';
            user.userId = userId;
            user.email = (dbUser && dbUser.email) ? dbUser.email : '';
            let gamePlayed;
            if (extendedInfo) {
                user.categoryIds = (dbUser && dbUser.categoryIds) ? dbUser.categoryIds : [];
                user.tags = (dbUser && dbUser.tags) ? dbUser.tags : [];

                // Get App Settings
                const appSetting = await AppSettings.Instance.getAppSettings();
                if (appSetting.social_profile) {
                    for (const socialProfile of appSetting.social_profile) {
                        if (socialProfile.enable) {
                            user[socialProfile.social_name] = dbUser[socialProfile.social_name];
                        }
                    }
                }
                user.account = new Account();
                const account = await AccountService.getAccountById(userId);
                user.account.avgAnsTime = (account && account.avgAnsTime) ? account.avgAnsTime : 0;
                user.account.badges = (account && account.badges) ? account.badges : 0;
                user.account.categories = (account && account.categories) ? account.categories : 0;
                user.account.contribution = (account && account.contribution) ? account.contribution : 0;
                user.account.wins = (account && account.wins) ? account.wins : 0;
                user.account.losses = (account && account.losses) ? account.losses : 0;
                user.account.gamePlayed = (account && account.gamePlayed) ? account.gamePlayed : 0;

                if (loginUserId && loginUserId !== '') {
                    const friendList = await FriendService.getFriendByInvitee(loginUserId);
                    if (friendList && friendList.myFriends) {
                        const game = friendList.myFriends.filter(element => element[userId] ? true : false);
                        if (game[0] && game[0][userId]) {
                            gamePlayed = game[0][userId];
                        }
                    }
                }

            }
            return { ...user, gamePlayed};
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
            const dbUser: User = await UserService.getUserById(userId);
            return await UserService.generateProfileImage(userId, dbUser.profilePicture, `${width}*${height}`);
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
            `${UserConstants.PROFILE}/${userId}/${UserConstants.AVATAR}/${size}/${profilePicture}`
            : `${UserConstants.PROFILE}/${userId}/${UserConstants.AVATAR}/${profilePicture}`;

        const file = UserService.bucket.file(fileName);
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
                const batch = UserService.fireStoreClient.batch();
                Object.keys(user).forEach(key => user[key] === undefined && delete user[key]);
                const userInstance = UserService.fireStoreClient.collection(CollectionConstants.USERS).doc(user.userId);
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

        const file = UserService.bucket.file(filePath);
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
        const users: User[] = await UserService.getUsers();

        const migrationPromises: Promise<any>[] = [];

        for (const user of users) {
            if (user && user.userId) {
                delete user.facebookUrl;
                delete user.linkedInUrl;
                delete user.twitterUrl;
                migrationPromises.push(UserService.updateUser({ ...user }));
            }
        }
        try {
            return await Promise.all(migrationPromises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
     * getUsersDisplayName
     * return users
     */
    static async getUsersByDisplayName(displayName: string): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(
                await UserService.fireStoreClient
                    .collection(CollectionConstants.USERS)
                    .where(GeneralConstants.DISPLAY_NAME, GeneralConstants.DOUBLE_EQUAL, displayName)
                    .get()
            );
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
   * add default number of lives into account
   * return ref
   */
    static async setUserDisplayName(user: any): Promise<any> {
        try {

            const appSetting = await AppSettings.Instance.loadAppSettings();

            let displayName = user.displayName ? user.displayName : '';

            if (appSetting.default_names.length > 0) {
                const randomNumber = Math.floor(Math.random() * Math.floor(appSetting.default_names.length));
                displayName = appSetting.default_names[randomNumber] + appSetting.user_display_name_value;
            }

            user['displayName'] = displayName;

            await UserService.updateUser({ ...user });

            AppSettings.Instance.updateUserDisplayNameValue(appSetting.user_display_name_value + 1);

            return user;

        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
