import {
    User
} from '../../projects/shared-library/src/lib/shared/model';

import { UserService } from '../services/user.service';
import * as sharp from 'sharp';


export class ProfileImagesGenerator {


    basePath = '/profile';
    profileImagePath = 'avatar';
    originalImagePath = 'original';

    constructor() {

    }

    public async fetchUsers(): Promise<any> {
        try {
            const users = await UserService.getUsers();
            const userImagesPromises = [];
            for (const user of users.docs) {
                const userObj: User = user.data();
                if (userObj.userId && userObj.profilePicture) {
                    userImagesPromises.push(this.getStoredImage(userObj.userId, userObj.profilePicture, undefined));
                }
            }
            return await Promise.all(userImagesPromises);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async uploadProfileImage(user: User): Promise<any> {

        let filePath = `${this.basePath}/${user.userId}/${this.originalImagePath}/${user.profilePicture}`;
        user.originalImageUrl = user.originalImageUrl.replace(/^data:image\/\w+;base64,/, '');
        let bufferStream = new Buffer(user.originalImageUrl, 'base64');

        try {

            await UserService.uploadProfileImage(bufferStream, user.imageType, filePath);

            filePath = `${this.basePath}/${user.userId}/${this.profileImagePath}/${user.profilePicture}`;
            user.croppedImageUrl = user.croppedImageUrl.replace(/^data:image\/\w+;base64,/, '');
            bufferStream = new Buffer(user.originalImageUrl, 'base64');

            await UserService.uploadProfileImage(bufferStream, user.imageType, filePath);
            await this.getStoredImage(user.userId, user.profilePicture, user.imageType);

            return user;

        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    public async getStoredImage(userId: string, profileImagePath: string, croppedImageType: string): Promise<any> {
        const imagesPromises = [];
        try {
            const dataStream = await UserService.generateProfileImage(userId, profileImagePath);
            imagesPromises.push(this.resizeImage(userId, profileImagePath, dataStream, croppedImageType, 263, 263));
            imagesPromises.push(this.resizeImage(userId, profileImagePath, dataStream, croppedImageType, 70, 60));
            imagesPromises.push(this.resizeImage(userId, profileImagePath, dataStream, croppedImageType, 44, 40));
            const userResults = await Promise.all(imagesPromises);
            return userResults;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private async resizeImage(userId: string, profileImagePath: String,
        dataStream: any, croppedImageType: string, width: Number, height: Number): Promise<string> {

        const filePath = `${this.basePath}/${userId}/${this.profileImagePath}/${width}*${height}/${profileImagePath}`;

        croppedImageType = (croppedImageType) ? croppedImageType : dataStream.mimetype;
        try {

            const data = await sharp(dataStream).resize(width, height).toBuffer();
            const result = await UserService.uploadProfileImage(data, croppedImageType, filePath);
            return result;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
