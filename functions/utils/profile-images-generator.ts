import {
    User, GeneralConstants, UserConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { UserService } from '../services/user.service';
import * as sharp from 'sharp';
import { Utils } from './utils';

export class ProfileImagesGenerator {

    static basePath = `${GeneralConstants.FORWARD_SLASH}${UserConstants.PROFILE}`;
    static profileImagePath = UserConstants.AVATAR;
    static originalImagePath = UserConstants.ORIGINAL;
    private static FS = GeneralConstants.FORWARD_SLASH;

    static async fetchUsers(): Promise<any> {
        try {
            const users: User[] = await UserService.getUsers();
            const userImagesPromises = [];
            for (const user of users) {
                if (user.userId && user.profilePicture) {
                    userImagesPromises.push(ProfileImagesGenerator.getStoredImage(user.userId, user.profilePicture, undefined));
                }
            }
            return await Promise.all(userImagesPromises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async uploadProfileImage(user: User): Promise<any> {

        let filePath = `${ProfileImagesGenerator.basePath}/${user.userId}/${ProfileImagesGenerator.originalImagePath}/${user.profilePicture}`;
        user.originalImageUrl = user.originalImageUrl.replace(/^data:image\/\w+;base64,/, '');
        let bufferStream = new Buffer(user.originalImageUrl, GeneralConstants.BASE64);

        try {

            await UserService.uploadProfileImage(bufferStream, user.imageType, filePath);

            filePath = `${ProfileImagesGenerator.basePath}/${user.userId}/${ProfileImagesGenerator.profileImagePath}/${user.profilePicture}`;
            user.croppedImageUrl = user.croppedImageUrl.replace(/^data:image\/\w+;base64,/, '');
            bufferStream = new Buffer(user.originalImageUrl, GeneralConstants.BASE64);

            await UserService.uploadProfileImage(bufferStream, user.imageType, filePath);
            await ProfileImagesGenerator.getStoredImage(user.userId, user.profilePicture, user.imageType);

            return user;

        } catch (error) {
            return Utils.throwError(error);
        }

    }

    static async getStoredImage(userId: string, profileImagePath: string, croppedImageType: string): Promise<any> {
        const imagesPromises = [];
        try {
            const dataStream = await UserService.generateProfileImage(userId, profileImagePath);
            imagesPromises.push(ProfileImagesGenerator.resizeImage(userId, profileImagePath, dataStream, croppedImageType,
                UserConstants.IMG_263, UserConstants.IMG_263));
            imagesPromises.push(ProfileImagesGenerator.resizeImage(userId, profileImagePath, dataStream, croppedImageType,
                UserConstants.IMG_70, UserConstants.IMG_60));
            imagesPromises.push(ProfileImagesGenerator.resizeImage(userId, profileImagePath, dataStream, croppedImageType,
                UserConstants.IMG_44, UserConstants.IMG_40));
            const userResults = await Promise.all(imagesPromises);
            return userResults;

        } catch (error) {
            return Utils.throwError(error);
        }
    }

    private static async resizeImage(userId: string, profileImagePath: String,
        dataStream: any, croppedImageType: string, width: Number, height: Number): Promise<string> {

        const filePath =
            `${ProfileImagesGenerator.basePath}${ProfileImagesGenerator.FS}${userId}${ProfileImagesGenerator.FS}${ProfileImagesGenerator.profileImagePath}${ProfileImagesGenerator.FS}${width}*${height}${ProfileImagesGenerator.FS}${profileImagePath}`;

        croppedImageType = (croppedImageType) ? croppedImageType : dataStream.mimetype;
        try {

            const data = await sharp(dataStream).resize(width, height).toBuffer();
            return await UserService.uploadProfileImage(data, croppedImageType, filePath);

        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
