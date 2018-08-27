import {
    User
} from '../../projects/shared-library/src/lib/shared/model';
const profileImagesUserService = require('../services/user.service');
const sharp = require('sharp');

export class ProfileImagesGenerator {


    private userDict: { [key: string]: number };

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
                        userImagesPromises.push(this.getStoredImage(userObj.userId, userObj.profilePicture));
                    }
                });
                return Promise.all(userImagesPromises)
                    .then((userImagesResults) => userImagesResults)
                    .catch((e) => {
                        console.log('user images generator error', e);
                    });
            });
    }

    public getStoredImage(userId: string, profileImageUrl: String): Promise<string> {
        const imagesPromises = [];
        return profileImagesUserService.generateProfileImage(userId, profileImageUrl).then((stream) => {
            imagesPromises.push(this.resizeImage(userId, profileImageUrl, stream, 263, 263));
            imagesPromises.push(this.resizeImage(userId, profileImageUrl, stream, 70, 60));
            imagesPromises.push(this.resizeImage(userId, profileImageUrl, stream, 44, 40));
            return Promise.all(imagesPromises)
                .then((imagesResults) => imagesResults)
                .catch((e) => {
                    console.log('images generator error', e);
                });
        });
    }

    private resizeImage(userId: string, profileImageUrl: String, stream: any, width: Number, height: Number): Promise<string> {
        return sharp(stream)
            .resize(width, height)
            .toBuffer()
            .then(data => {
                return profileImagesUserService
                    .uploadProfileImage(userId, profileImageUrl, data, `${width}*${height}`, stream).then((file) => {
                        return `${userId} with dimensions ${width}*${height} file is uploaded successfully`;
                    });
            })
            .catch(err => {
                console.log('error-->', err);
                return err;
            });
    }

}
