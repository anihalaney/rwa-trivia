import { CollectionConstants, GeneralConstants, User, UserConstants, Account } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import { AccountService } from './account.service';
import { AppSettings } from '../services/app-settings.service';
import { FriendService } from './friend.service';
import * as requestPromise from 'request-promise';
import { externalUrl } from '../../projects/shared-library/src/lib/environments/external-url';
import * as firebase from 'firebase-admin';

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
                .doc(`/${CollectionConstants.USERS}/${userId}/`)
                .get();
            return userData.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
     * getOtherUserByIdWithGameStat
     * return userGameStatwith other user
    */
    static async getOtherUserGameStatById(userId: string, otherUserId): Promise<any> {
        try {
            const userData = await UserService.fireStoreClient
                .doc(`/${CollectionConstants.USERS}/${userId}/game_played_with/${otherUserId}`)
                .get();
            return userData.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setUser Game stat with other user
     * return ref
     */
    static async setGameStat(gameStat: any, userId, otherUserId: any): Promise<any> {
        try {
            return await UserService.fireStoreClient
                .doc(`/${CollectionConstants.USERS}/${userId}/game_played_with/${otherUserId}`)
                .set(gameStat, { merge: true });
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * updateUser
     * return ref
     */
    static async updateUser(dbUser: any): Promise<any> {
        if (dbUser && dbUser.userId) {
            try {
                return await UserService.fireStoreClient
                    .doc(`/${CollectionConstants.USERS}/${dbUser.userId}`)
                    .set(dbUser, { merge: true });
            } catch (error) {
                return Utils.throwError(error);
            }
        } else {
            return false;
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
    static async getUserProfile(userId: string, loggedInUserId = '', extendedInfo = false): Promise<any> {
        try {
            const dbUser: User = await UserService.getUserById(userId);
            const user = new User();
            user.displayName = (dbUser && dbUser.displayName) ? dbUser.displayName : '';
            user.location = (dbUser && dbUser.location) ? dbUser.location : '';
            user.profilePicture = (dbUser && dbUser.profilePicture) ? dbUser.profilePicture : '';
            user.userId = userId;
            user.email = (dbUser && dbUser.email) ? dbUser.email : '';
            let gamePlayed;
            let isFriend = false;
            const account = await AccountService.getAccountById(userId);
            user.bits = (account && account.bits) ? account.bits : 0;
            if (extendedInfo) {
                user.categoryIds = (dbUser && dbUser.categoryIds) ? dbUser.categoryIds : [];
                user.tags = (dbUser && dbUser.tags) ? dbUser.tags : [];

                // Get App Settings
                const appSetting = await AppSettings.Instance.getAppSettings();
                if (appSetting.social_profile) {
                    for (const socialProfile of appSetting.social_profile) {
                        if (socialProfile.enable) {
                            user[socialProfile.social_name] = (dbUser[socialProfile.social_name]) ? dbUser[socialProfile.social_name] : '';
                        }
                    }
                }
                user.account = new Account();
                user.account.avgAnsTime = (account && account.avgAnsTime) ? account.avgAnsTime : 0;
                user.account.badges = (account && account.badges) ? account.badges : 0;
                user.account.bits = (account && account.bits) ? account.bits : 0;
                user.account.bytes = (account && account.bytes) ? account.bytes : 0;
                user.account.categories = (account && account.categories) ? account.categories : 0;
                user.account.contribution = (account && account.contribution) ? account.contribution : 0;
                user.account.wins = (account && account.wins) ? account.wins : 0;
                user.account.losses = (account && account.losses) ? account.losses : 0;
                user.account.gamePlayed = (account && account.gamePlayed) ? account.gamePlayed : 0;
                const friendList = await FriendService.getFriendByInvitee(userId);
                user.totalFriends = (friendList && friendList.myFriends) ? friendList.myFriends.length : 0;
                if (loggedInUserId && loggedInUserId !== '') {
                    gamePlayed = await UserService.getOtherUserGameStatById(loggedInUserId, userId);

                }

            }
            if (loggedInUserId && loggedInUserId !== '') {
                const friendList = await FriendService.getFriendByInvitee(loggedInUserId);

                if (friendList && friendList.myFriends) {
                    if (loggedInUserId === userId) {
                        user.totalFriends = friendList.myFriends.length;
                    }
                    const friend = friendList.myFriends.filter(element => element[userId] ? true : false);
                    isFriend = friend[0] ? true : false;
                }
            }
            return { ...user, gamePlayed, 'isFriend': isFriend };
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
    static async setUserDetails(user: any): Promise<any> {
        try {

            const appSetting = await AppSettings.Instance.loadAppSettings();

            let displayName = user.displayName ? user.displayName : '';

            if (appSetting.default_names.length > 0) {
                const randomNumber = Math.floor(Math.random() * Math.floor(appSetting.default_names.length));
                displayName = appSetting.default_names[randomNumber] + appSetting.user_display_name_value;
            }

            user['displayName'] = displayName;
            user['isCategorySet'] = false;
            await UserService.updateUser({ ...user });

            AppSettings.Instance.updateUserDisplayNameValue(appSetting.user_display_name_value + 1);

            return user;

        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * updateUserGameStat
     * return status
     */
    static async updateUserGamePlayedWithStat(): Promise<any> {
        try {
            const friendsData = await FriendService.getFriendsCollection();
            const promises = [];
            for (const doc of friendsData.docs) {
                const friends = doc.data();
                const userId = doc.id;
                const updateUser = { ...friends };
                for (const [index, friendMetaDataMap] of friends.myFriends.entries()) {
                    for (const friendUserId of Object.keys(friendMetaDataMap)) {
                        promises.push(UserService.setGameStat({ ...friendMetaDataMap[friendUserId] }, userId, friendUserId));
                        if (updateUser.myFriends[index] && updateUser.myFriends[index][friendUserId] &&
                            friendMetaDataMap[friendUserId] && friendMetaDataMap[friendUserId].created_uid) {

                            updateUser.myFriends[index][friendUserId] = {
                                'created_uid': friendMetaDataMap[friendUserId].created_uid,
                                'date': friendMetaDataMap[friendUserId].date ?
                                    friendMetaDataMap[friendUserId].date : new Date().getUTCDate()
                            };
                        }
                    }
                }
                promises.push(FriendService.setFriend(updateUser, userId));
            }
            return await Promise.all(promises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    static async getGeoCode(location): Promise<any> {
        try {
            if(location && location._lat && location._long) {
                return new firebase.firestore.GeoPoint(location._lat, location._long);
            } else if(location && location.latitude && location.longitude) {
                return new firebase.firestore.GeoPoint(location.latitude, location.longitude);
            } else {
                return '';
            }
            

        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
