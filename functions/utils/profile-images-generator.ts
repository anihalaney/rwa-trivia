import {
    User
} from '../../projects/shared-library/src/lib/shared/model';

import { UserService } from '../services/user.service';
const profileImagesUserService: UserService = new UserService();
const stream = require('stream');
const sharp = require('sharp');

export class ProfileImagesGenerator {


    private userDict: { [key: string]: number };
    basePath = '/profile';
    profileImagePath = 'avatar';
    originalImagePath = 'original';

    constructor() {
        this.userDict = {};
    }

    public fetchUsers(): Promise<any> {
        return profileImagesUserService.getUsers()
            .then(users => {
                const userImagesPromises = [];
                users.docs.map(user => {
                    const userObj: User = user.data();
                    if (userObj.userId && userObj.profilePicture) {
                        userImagesPromises.push(this.getStoredImage(userObj.userId, userObj.profilePicture, undefined));
                    }
                });
                return Promise.all(userImagesPromises)
                    .then((userImagesResults) => userImagesResults)
                    .catch((e) => {
                        console.log('user images generator error', e);
                    });
            });
    }

    public async uploadProfileImage(user: User): Promise<any> {

        let filePath = `${this.basePath}/${user.userId}/${this.originalImagePath}/${user.profilePicture}`;
        user.originalImageUrl = user.originalImageUrl.replace(/^data:image\/\w+;base64,/, '');
        let bufferStream = new Buffer(user.originalImageUrl, 'base64');

        try {

            await profileImagesUserService.uploadProfileImage(bufferStream, user.imageType, filePath);

            filePath = `${this.basePath}/${user.userId}/${this.profileImagePath}/${user.profilePicture}`;
            user.croppedImageUrl = user.croppedImageUrl.replace(/^data:image\/\w+;base64,/, '');
            bufferStream = new Buffer(user.originalImageUrl, 'base64');

            await profileImagesUserService.uploadProfileImage(bufferStream, user.imageType, filePath);

            return await this.getStoredImage(user.userId, user.profilePicture, user.imageType);

        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    public async getStoredImage(userId: string, profileImagePath: string, croppedImageType: string): Promise<any> {
        const imagesPromises = [];
        try {
            const dataStream = await profileImagesUserService.generateProfileImage(userId, profileImagePath);
            imagesPromises.push(this.resizeImage(userId, profileImagePath, dataStream, croppedImageType, 263, 263));
            imagesPromises.push(this.resizeImage(userId, profileImagePath, dataStream, croppedImageType, 70, 60));
            imagesPromises.push(this.resizeImage(userId, profileImagePath, dataStream, croppedImageType, 44, 40));

            return await Promise.all(imagesPromises);

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

            return await profileImagesUserService.uploadProfileImage(data, croppedImageType, filePath);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
