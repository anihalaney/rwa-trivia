import {
    User
} from '../../projects/shared-library/src/lib/shared/model';
const profileImagesUserService = require('../services/user.service');
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

    public uploadProfileImage(user: User): Promise<string> {

        let filePath = `${this.basePath}/${user.userId}/${this.originalImagePath}/${user.profilePicture}`;
        user.originalImageUrl = user.originalImageUrl.replace(/^data:image\/\w+;base64,/, '');
        let bufferStream = new Buffer(user.originalImageUrl, 'base64');

        return profileImagesUserService
            .uploadProfileImage(bufferStream, user.imageType, filePath).then((orgImageUploadStatus) => {
                console.log('orgImageUploadStatus', orgImageUploadStatus);
                filePath = `${this.basePath}/${user.userId}/${this.profileImagePath}/${user.profilePicture}`;
                user.croppedImageUrl = user.croppedImageUrl.replace(/^data:image\/\w+;base64,/, '');
                bufferStream = new Buffer(user.originalImageUrl, 'base64');
                return profileImagesUserService
                    .uploadProfileImage(bufferStream, user.imageType, filePath).then((croppedImageStatus) => {
                        console.log('croppedImageStatus', croppedImageStatus);
                        return this.getStoredImage(user.userId, user.profilePicture, user.imageType)
                            .then((uploadStatus) => uploadStatus).catch((e) => {
                                console.log('images generator error', e);
                            });
                    }).catch((e) => {
                        console.log('images generator error', e);
                    });
            }).catch((e) => {
                console.log('images generator error', e);
            });
    }

    public getStoredImage(userId: string, profileImagePath: String, croppedImageType: string): Promise<string> {
        const imagesPromises = [];
        return profileImagesUserService.generateProfileImage(userId, profileImagePath).then((dataStream) => {
            imagesPromises.push(this.resizeImage(userId, profileImagePath, dataStream, croppedImageType, 263, 263));
            imagesPromises.push(this.resizeImage(userId, profileImagePath, dataStream, croppedImageType, 70, 60));
            imagesPromises.push(this.resizeImage(userId, profileImagePath, dataStream, croppedImageType, 44, 40));
            return Promise.all(imagesPromises)
                .then((imagesResults) => imagesResults)
                .catch((e) => {
                    console.log('images generator error', e);
                });
        });
    }

    private resizeImage(userId: string, profileImagePath: String,
        dataStream: any, croppedImageType: string, width: Number, height: Number): Promise<string> {

        const filePath = `${this.basePath}/${userId}/${this.profileImagePath}/${width}*${height}/${profileImagePath}`;

        croppedImageType = (croppedImageType) ? croppedImageType : dataStream.mimetype;

        return sharp(dataStream)
            .resize(width, height)
            .toBuffer()
            .then(data => {

                return profileImagesUserService
                    .uploadProfileImage(data, croppedImageType, filePath).then((file) => {
                        return `${userId} with dimensions ${width}*${height} file is uploaded successfully`;
                    });
            })
            .catch(err => {
                console.log('error-->', err);
                return err;
            });
    }

}
